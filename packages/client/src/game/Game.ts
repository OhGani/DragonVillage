import {
  AIR_ID,
  type BlockChangedMsg,
  CHUNK_SIZE,
  type ChunkDataMsg,
  type ExpeditionEnterInfo,
  type ExpeditionPhase,
  type ExpeditionStateInfo,
  EMOTE_EMOJI,
  FLAG_GROUND,
  HOTBAR_SLOTS,
  type Inventory,
  STATION_KO,
  cloneInventory,
  itemToBlock,
  FLAG_SNEAK,
  FLAG_SPRINT,
  FLAG_WATER,
  LightEngine,
  NIGHT_SKY,
  REJECT_KO,
  type VoxelWorld,
  decodeChunk,
  generateIsland,
  generateVillage,
  itemName,
  phaseAt,
  portalContains,
  skyLightAt,
} from '@dragon-village/shared';
import { BLOCKS, EXPEDITIONS, ITEM_NAMES, PHRASES, POTIONS, RECIPES } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { GamepadInput } from '../input/gamepad';
import { InputManager } from '../input/InputManager';
import { KeyboardMouse } from '../input/keyboard';
import { TouchControls } from '../input/touch';
import { buildMeshBlockInfo } from '../mesh/blockInfo';
import type { ExpeditionResult, NetClient, Welcome, WorldEnter } from '../net/NetClient';
import { RemotePlayers } from '../net/RemotePlayers';
import { Player } from '../player/Player';
import { SKY_COLOR, createChunkMaterials } from '../render/ChunkMaterial';
import { ChunkRenderer } from '../render/ChunkRenderer';
import { HandView } from '../render/Hand';
import { BlockHighlight } from '../render/Highlight';
import { PortalView } from '../render/Portal';
import { Sky } from '../render/Sky';
import { loadTextureAtlas } from '../render/textures';
import { BagView, type Stations } from '../ui/bag';
import { ChatView } from '../ui/chat';
import { Hud, type HotbarSlot } from '../ui/hud';
import { askInput, askPin } from '../ui/pinDialog';
import { itemIcon } from '../ui/itemIcon';
import { MesherPool } from '../workers/MesherPool';
import { AutoQuality } from './AutoQuality';
import { Interaction } from './Interaction';

/** 근처 작업대 확인 간격 */
const STATION_CHECK_MS = 500;
/** 위치 전송 간격 (20Hz) */
const MOVE_SEND_MS = 50;
/** M3 는 첫 원정지 하나 (포탈 단계 해제는 M6) */
const FIRST_EXPEDITION = 'grass_island';

export interface GameOptions {
  isTouch: boolean;
  /** 이미 마을에 들어간 연결 */
  net: NetClient;
  welcome: Welcome;
}

export interface GameHandle {
  /** 오버레이를 닫고 조작을 시작한다 (사용자 제스처 안에서 호출) */
  start(): void;
  dispose(): void;
}

/** yaw 0°·45°·… 순서 (yaw 0 = -Z 북, yaw 90° = -X 서). 나침반의 HEADING_NAMES 와 반대 방향으로 돈다 */
const FACING = ['북', '북서', '서', '남서', '남', '남동', '동', '북동'];

/** 지금 들어가 있는 세계 하나 (마을 또는 원정지). 전환할 때 통째로 바꾼다 */
interface WorldCtx {
  kind: 'village' | 'expedition';
  world: VoxelWorld;
  light: LightEngine;
  chunks: ChunkRenderer;
  player: Player;
  interaction: Interaction;
  portal: PortalView;
  /** 포탈 문틀 아래 가운데 (안에 서면 카드) */
  portalPos: { x: number; y: number; z: number };
  genMs: number;
  /** 원정이면 정보 (타이머·낮밤) */
  expedition: ExpeditionEnterInfo | null;
  /** 원정: performance.now() 기준 시작 시각 (서버 시각 차를 보정) */
  localStart: number;
}

export async function createGame(root: HTMLElement, opts: GameOptions): Promise<GameHandle> {
  const { isTouch, net, welcome } = opts;
  const registry = BLOCKS;
  const atlas = await loadTextureAtlas();
  const blockInfo = buildMeshBlockInfo(registry, atlas.index);
  const myIdx = welcome.playerIdx;

  // ---- 렌더러 ----
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false });
  renderer.domElement.className = 'game';
  renderer.domElement.tabIndex = 0;
  renderer.autoClear = false;
  renderer.setClearColor(SKY_COLOR, 1);
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 600);
  camera.rotation.order = 'YXZ';

  const materials = createChunkMaterials(atlas.texture);
  const pool = new MesherPool(blockInfo);
  const renderDistance = isTouch ? 5 : 8;
  const applyFog = () => {
    const d = renderDistance * CHUNK_SIZE;
    materials.setFog(d * 0.55, d * 0.98);
    camera.far = d * 1.3 + 50;
    camera.updateProjectionMatrix();
  };
  applyFog();

  const sky = new Sky(scene);
  const highlight = new BlockHighlight(scene);
  const hand = new HandView(materials, blockInfo);
  const remote = new RemotePlayers(scene);

  // ---- HUD ----
  const hud = new Hud(root, isTouch);
  const nameOf = (id: string) => (id in STATION_KO ? STATION_KO[id as keyof typeof STATION_KO] : itemName(id, registry, ITEM_NAMES));
  const iconOf = (id: string, size: number): HTMLCanvasElement | null => itemIcon(id, size, registry, atlas, nameOf(id));

  // ---- 가방 (M4): 서버가 진실. welcome 으로 받고 InvSlots 로 고친다 ----
  const inv: Inventory = cloneInventory(welcome.inventory);
  const refreshHotbar = () => {
    const slots: HotbarSlot[] = [];
    for (let i = 0; i < HOTBAR_SLOTS; i++) {
      const s = inv[i];
      slots.push(s ? { item: s.item, count: s.count, name: nameOf(s.item), icon: iconOf(s.item, 40) } : { item: null, count: 0, name: '빈 칸', icon: null });
    }
    hud.setSlots(slots);
  };
  refreshHotbar();
  /** 손에 든 아이템으로 놓을 블록 번호 (없거나 못 놓으면 0) */
  const heldBlock = (): number => {
    const item = hud.selectedItem;
    return item ? (itemToBlock(item, registry) ?? 0) : 0;
  };
  let expeditionState: ExpeditionStateInfo | null = welcome.expedition;
  const updateVillageInfo = () => {
    const exp = expeditionState ? ` · 원정 중: ${expeditionState.name} ${expeditionState.players}명` : '';
    hud.setVillageInfo(`마을 "${welcome.village.name}" · 코드 ${welcome.village.code} · 지금 ${remote.count + 1}명${exp} (친구에게 코드를 알려 주면 같은 마을에 들어와요)`);
  };

  // ---- 가방 화면·채팅 (M4) ----
  const bag = new BagView(root, {
    recipes: RECIPES,
    potions: POTIONS,
    icon: iconOf,
    nameOf,
    onMove: (from, to, count) => net.sendInvMove(from, to, count),
    onDrop: (slot, count) => net.sendInvDrop(slot, count),
    onCraft: (recipe) => net.sendCraft(recipe),
    onBrew: (bottles, ingredient) => {
      net.sendBrew(bottles, ingredient);
      bag.clearBrewSelection();
    },
    onClose: () => closeBag(),
  });
  bag.setInventory(inv);
  const chat = new ChatView(
    root,
    PHRASES,
    (kind, id) => net.sendEmote(kind, id),
    () => closeChat(),
  );
  let stationTimer = 0;
  /** 5칸 안에 제작대·화로·양조기가 있나 (서버와 같은 규칙) */
  const scanStations = (): Stations => {
    const out: Stations = {};
    const w = ctx.world;
    const p = ctx.player.pos;
    const cx = Math.floor(p.x),
      cy = Math.floor(p.y + 1),
      cz = Math.floor(p.z);
    const want = new Map<number, keyof Stations>();
    for (const id of ['crafting_table', 'furnace', 'brewing_stand'] as const) {
      const d = registry.find(id);
      if (d) want.set(d.num, id);
    }
    for (let y = cy - 5; y <= cy + 5 && want.size; y++)
      for (let z = cz - 5; z <= cz + 5 && want.size; z++)
        for (let x = cx - 5; x <= cx + 5 && want.size; x++) {
          if (!w.inBounds(x, y, z)) continue;
          const k = want.get(w.getBlock(x, y, z));
          if (k) {
            out[k] = true;
            want.delete(w.getBlock(x, y, z));
          }
        }
    return out;
  };

  // ---- 입력 ----
  const input = new InputManager();
  const kbm = new KeyboardMouse(renderer.domElement);
  input.add(kbm);
  const touch = new TouchControls(hud.touchUI);
  input.add(touch);
  input.add(new GamepadInput());
  input.paused = true;

  // ---- 블록 변경: 먼저 화면에 그리고(낙관) 서버가 거절하면 되돌린다 ----
  const pending = new Map<number, { x: number; y: number; z: number; prev: number; id: number }>();
  let seq = 0;
  const sendBlock = (x: number, y: number, z: number, newNum: number, prev: number) => {
    seq = (seq + 1) & 0xffff;
    pending.set(seq, { x, y, z, prev, id: newNum });
    net.sendBlockChange({ seq, x, y, z, id: registry.get(newNum).id });
    if (pending.size > 200) pending.delete(pending.keys().next().value!); // 응답이 영영 안 오면 오래된 것부터 잊는다
  };
  const forgetPendingAt = (x: number, y: number, z: number) => {
    for (const [k, v] of pending) if (v.x === x && v.y === y && v.z === z) pending.delete(k);
  };

  // ---- 세계 만들기·전환 ----
  let ctx!: WorldCtx;
  const buildWorld = (
    kind: WorldCtx['kind'],
    expedition: ExpeditionEnterInfo | null,
    spawn: { x: number; y: number; z: number; yaw: number; pitch: number },
    chunkData: readonly ChunkDataMsg[],
  ): WorldCtx => {
    // 서버가 준 시드로 똑같이 만들고, 서버가 보낸 바뀐 청크를 덮어쓴다 (서버가 진실, 규칙 1)
    const gen = kind === 'expedition' && expedition ? generateIsland(registry, expedition.seed, expedition.treasures) : generateVillage(registry, welcome.village.seed);
    const { world } = gen;
    for (const c of chunkData) if (world.chunkInBounds(c.cx, c.cy, c.cz)) decodeChunk(c.bytes, registry, world.getOrCreateChunk(c.cx, c.cy, c.cz));
    // 조명: 블록이 모두 자리 잡은 뒤 한 번 전체 계산. 이후는 바뀐 칸만
    const light = new LightEngine(world, registry);
    light.computeAll();
    const chunks = new ChunkRenderer(world, light, materials, pool, scene);
    chunks.renderDistance = renderDistance;
    chunks.markAll();
    const player = new Player(world, registry, spawn, spawn.yaw);
    player.pitch = spawn.pitch;
    const applyServerBlock = (x: number, y: number, z: number, id: string) => {
      const def = registry.find(id);
      const num = def ? def.num : AIR_ID;
      const res = world.setBlock(x, y, z, num);
      if (res.changed) {
        chunks.markDirtyAll(res.dirty);
        light.markChanged(x, y, z);
      }
    };
    const interaction = new Interaction(world, registry, player, {
      onBlocksChanged: (dirty) => chunks.markDirtyAll(dirty),
      onSwing: () => hand.swing(),
      onPlaced: (x, y, z, id, prev) => {
        light.markChanged(x, y, z);
        sendBlock(x, y, z, id, prev);
      },
      onBroken: (x, y, z, prev) => {
        light.markChanged(x, y, z);
        sendBlock(x, y, z, AIR_ID, prev);
      },
    });
    const portalPos = gen.layout.portal;
    const portal = new PortalView(scene, portalPos, kind === 'expedition' ? 0x3fbcfc : 0x8a3ffc);
    const c: WorldCtx & { applyServerBlock: typeof applyServerBlock } = {
      kind,
      world,
      light,
      chunks,
      player,
      interaction,
      portal,
      portalPos,
      genMs: gen.ms,
      expedition,
      localStart: expedition ? performance.now() - (expedition.serverNow - expedition.startedAt) : 0,
      applyServerBlock,
    };
    return c;
  };
  const applyServerBlock = (x: number, y: number, z: number, id: string) => (ctx as WorldCtx & { applyServerBlock: (x: number, y: number, z: number, id: string) => void }).applyServerBlock(x, y, z, id);

  const disposeWorld = (c: WorldCtx) => {
    c.chunks.dispose();
    scene.remove(c.chunks.group);
    c.portal.dispose();
  };

  /** 낮밤 (원정 경과에 따라). 마을은 항상 낮 */
  let skyLevel = 1;
  const applySky = (v: number) => {
    if (Math.abs(v - skyLevel) < 0.002) return;
    skyLevel = v;
    materials.setSkyLight(v);
    sky.setBrightness(v);
    renderer.setClearColor(SKY_COLOR.clone().multiplyScalar(v), 1);
  };

  ctx = buildWorld('village', null, { ...welcome.spawn }, welcome.chunks);
  for (const p of welcome.players) remote.upsert(p);
  updateVillageInfo();

  let warned3 = false,
    warned1 = false;
  const enterWorld = (w: WorldEnter) => {
    disposeWorld(ctx);
    pending.clear();
    ctx = buildWorld(w.kind, w.expedition, { ...w.spawn }, w.chunks);
    // 그 세계에 있는 사람들만 보인다
    for (const idx of remote.indices()) remote.remove(idx);
    for (const p of w.players) remote.upsert(p);
    warned3 = warned1 = false;
    hud.hideAction();
    if (w.kind === 'expedition' && w.expedition) {
      hud.toast(`${w.expedition.name}에 도착했어요! 가운데 포탈로 돌아오면 모은 것을 가져가요`, 5000);
    } else {
      applySky(1);
      hud.setTimer(null, null);
      hud.toast('마을로 돌아왔어요', 3000);
    }
    updateVillageInfo();
    sendMove();
  };

  const showResult = (r: ExpeditionResult) => {
    const items = r.items.map((it) => ({ name: itemName(it.id, registry, ITEM_NAMES), count: it.count, icon: iconOf(it.id, 28) }));
    const total = r.items.reduce((s, it) => s + it.count, 0);
    const mm = Math.floor(r.elapsedSec / 60),
      ss = r.elapsedSec % 60;
    const sub = r.late
      ? `시간이 다 되어 저절로 돌아왔어요. 절반만 가져왔어요 (${Math.round(r.keepRatio * 100)}%)`
      : `${mm}분 ${ss}초 만에 돌아왔어요. 모은 것 ${total}개를 마을 창고에 넣었어요`;
    input.paused = true;
    kbm.enabled = false;
    hud.showResult(`${r.name} 원정 끝!`, sub, items, '한 번 더 갈까?', () => {
      net.sendStartExpedition(r.expedition);
      resume();
    }, () => resume());
  };

  // ---- 서버에서 오는 것 ----
  let disconnected = false;
  net.attach({
    onChunk: (m) => {
      if (!ctx.world.chunkInBounds(m.cx, m.cy, m.cz)) return;
      decodeChunk(m.bytes, registry, ctx.world.getOrCreateChunk(m.cx, m.cy, m.cz));
      ctx.chunks.markDirty(m.cx, m.cy, m.cz);
      // 청크 통째로 바뀌었으니 그 안의 빛은 전부 다시
      for (let y = 0; y < CHUNK_SIZE; y++) for (let z = 0; z < CHUNK_SIZE; z++) for (let x = 0; x < CHUNK_SIZE; x++) ctx.light.markChanged(m.cx * 16 + x, m.cy * 16 + y, m.cz * 16 + z);
    },
    onBlockChanged: (m: BlockChangedMsg) => {
      forgetPendingAt(m.x, m.y, m.z);
      applyServerBlock(m.x, m.y, m.z, m.id);
    },
    onBlockBatch: (m) => {
      for (const b of m.blocks) applyServerBlock(b.x, b.y, b.z, b.id);
    },
    onRejected: (m) => {
      const p = pending.get(m.seq);
      pending.delete(m.seq);
      if (p) {
        const res = ctx.world.setBlock(p.x, p.y, p.z, p.prev);
        if (res.changed) {
          ctx.chunks.markDirtyAll(res.dirty);
          ctx.light.markChanged(p.x, p.y, p.z);
        }
        // 문은 두 칸 (#71): 다른 반쪽도 되돌린다 — 놓기였으면 공기로, 열고 닫기·부수기였으면 원래 상태로
        const dPrev = registry.get(p.prev).door;
        const d = registry.get(p.id).door ?? dPrev;
        if (d) {
          const oy = d.upper ? p.y - 1 : p.y + 1;
          const other = dPrev ? registry.doorVariant(dPrev.base, dPrev.facing, !dPrev.upper, dPrev.open) : AIR_ID;
          const r2 = ctx.world.setBlock(p.x, oy, p.z, other);
          if (r2.changed) {
            ctx.chunks.markDirtyAll(r2.dirty);
            ctx.light.markChanged(p.x, oy, p.z);
          }
        }
      }
      hud.toast(REJECT_KO[m.reason] ?? '서버가 거절했어요', 2500);
    },
    onPlayers: (list) => remote.setState(list, myIdx),
    onPlayerJoined: (p) => {
      remote.upsert(p);
      hud.toast(ctx.kind === 'expedition' ? `${p.nick} 님이 원정에 왔어요` : `${p.nick} 님이 들어왔어요`, 3000);
      updateVillageInfo();
    },
    onPlayerLeft: (idx) => {
      const nick = remote.nickOf(idx);
      remote.remove(idx);
      if (nick) hud.toast(ctx.kind === 'expedition' ? `${nick} 님이 마을로 갔어요` : `${nick} 님이 나갔어요`, 3000);
      updateVillageInfo();
    },
    onError: (_code, message) => hud.toast(message, 4000),
    onToday: (card) => hud.setToday(card),
    onApprovalAsk: (ask) => hud.showApproval(ask),
    onClose: (reason) => {
      disconnected = true;
      input.paused = true;
      kbm.enabled = false;
      hud.showOverlay('서버와 연결이 끊어졐어요', reason + '\n다시 들어가려면 아래를 눌러요.', '다시 연결');
    },
    onWorldEnter: enterWorld,
    onExpeditionResult: showResult,
    onExpeditionState: (s) => {
      const wasActive = !!expeditionState;
      expeditionState = s;
      if (!wasActive && s && ctx.kind === 'village') hud.toast(`${s.name} 원정이 시작됐어요! 포탈에서 따라갈 수 있어요`, 5000);
      updateVillageInfo();
    },
    onTimer: (m) => {
      // 서버 시각으로 내 시계를 맞춘다
      if (ctx.expedition) ctx.localStart = performance.now() - m.elapsedSec * 1000;
    },
    onInvSlots: (m) => {
      for (const e of m.slots) if (e.slot >= 0 && e.slot < inv.length) inv[e.slot] = e.count > 0 ? { item: e.item, count: e.count } : null;
      refreshHotbar();
      bag.setInventory(inv);
    },
    onEmote: (m) => {
      const text = PHRASES.text(m.kind, m.id);
      if (!text) return;
      const nick = m.idx === myIdx ? '나' : (remote.nickOf(m.idx) ?? '누군가');
      chat.add(nick, text);
      if (m.idx !== myIdx) remote.say(m.idx, text, m.kind === EMOTE_EMOJI ? 2.5 : 3.5);
      else hud.toast(text, 2500);
    },
  });

  // ---- 화면 크기 → 캔버스 버퍼 + 카메라 비율. 한 함수에서만 맞춘다 (어긋나면 화면이 눌려 보인다) ----
  const quality = new AutoQuality(renderer, isTouch);
  let sizeW = 0,
    sizeH = 0;
  const applySize = (force = false) => {
    const w = root.clientWidth || window.innerWidth;
    const h = root.clientHeight || window.innerHeight;
    if (w <= 0 || h <= 0) return;
    if (!force && w === sizeW && h === sizeH) return;
    sizeW = w;
    sizeH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  quality.onChange = () => applySize(true); // 배율이 바뀌면 버퍼를 다시 만든다
  applySize(true);
  const resize = () => applySize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));
  // 전체화면 전환·주소창 등 resize 이벤트 없이 크기가 바뀌는 경우까지
  document.addEventListener('fullscreenchange', () => {
    resize();
    setTimeout(resize, 300);
  });
  window.visualViewport?.addEventListener('resize', resize);
  const sizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  sizeObserver?.observe(root);

  // ---- 전체화면 / 디버그 버튼 ----
  let debugVisible = false;
  hud.debugBtn.addEventListener('click', () => (debugVisible = !debugVisible));

  // 홈 화면에 추가해서 앱처럼 열렸으면 이미 전체화면
  const standalone =
    window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // 아이폰 사파리는 전체화면 API 가 없다 → 홈 화면 추가 안내
  const fullscreenAvailable = !!document.fullscreenEnabled && typeof document.documentElement.requestFullscreen === 'function';
  const IOS_HINT = '이 브라우저는 전체화면이 안 돼요.\n공유 버튼 → "홈 화면에 추가" 로 열면 전체화면이 돼요.';

  const updateFullscreenButton = () => {
    if (standalone) hud.setFullscreen('hidden');
    else if (!fullscreenAvailable) hud.setFullscreen('unavailable');
    else hud.setFullscreen(document.fullscreenElement ? 'on' : 'off');
  };
  updateFullscreenButton();
  document.addEventListener('fullscreenchange', updateFullscreenButton);

  async function enterFullscreen(): Promise<boolean> {
    if (!fullscreenAvailable) return false;
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      const o = screen.orientation as ScreenOrientation & { lock?: (t: string) => Promise<void> };
      if (o.lock) await o.lock('landscape').catch(() => undefined);
      return true;
    } catch {
      return false;
    }
  }
  async function exitFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      /* 무시 */
    }
  }
  hud.fullscreenBtn.addEventListener('click', () => {
    if (!fullscreenAvailable) {
      hud.toast(IOS_HINT, 7000);
      return;
    }
    if (document.fullscreenElement) void exitFullscreen();
    else
      void enterFullscreen().then((ok) => {
        if (!ok) hud.toast('전체화면을 켤 수 없었어요. 다시 한 번 눌러 보세요.', 4000);
      });
  });

  // ---- 시작 / 일시정지 ----
  let started = false;
  let lockWarned = false;
  const pause = () => {
    input.paused = true;
    kbm.enabled = false;
    hud.showOverlay('잠깐 멈춤', 'ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.', '계속하기');
  };
  const resume = () => {
    if (disconnected) return;
    hud.hideOverlay();
    input.paused = false;
    kbm.enabled = true;
    renderer.domElement.focus();
    if (!isTouch) {
      void kbm.requestLock().then((ok) => {
        if (!ok && !lockWarned) {
          lockWarned = true;
          hud.toast('이 브라우저는 마우스 잠금이 안 돼요. 마우스를 움직여 둘러보세요.', 5000);
        }
      });
    }
  };
  const openBag = () => {
    if (!started || disconnected || hud.resultVisible) return;
    input.paused = true;
    kbm.enabled = false;
    if (kbm.locked) document.exitPointerLock();
    bag.setStations(scanStations());
    bag.setInventory(inv);
    bag.show();
  };
  const closeBag = () => {
    if (!bag.visible) return;
    bag.hide();
    if (started && !hud.overlayVisible && !hud.resultVisible && !chat.visible) resume();
  };
  const openChat = () => {
    if (!started || disconnected || hud.resultVisible) return;
    input.paused = true;
    kbm.enabled = false;
    if (kbm.locked) document.exitPointerLock();
    chat.show();
  };
  const closeChat = () => {
    if (!chat.visible) return;
    chat.hide();
    if (started && !hud.overlayVisible && !hud.resultVisible && !bag.visible) resume();
  };
  hud.bagBtn.addEventListener('click', () => (bag.visible ? closeBag() : openBag()));
  // 오늘 카드 (M5-3): 아이면 남은 시간·할 일. 시간 제한은 걸지 않는다(표시만, 아빠 2026-09-19)
  hud.setToday(welcome.today);
  hud.onCheckTodo = (id) => net.sendCheckTodo(id);
  hud.onApprove = (ask, ok) => net.sendApproveTodo(ask.id, ask.date, ok);
  if (welcome.today) hud.toast(`오늘 남은 시간 ${welcome.today.remainingMin}분 · 할 일 ${welcome.today.todos.length}개 — 위의 ⏱ 를 누르면 보여요`, 6000);
  // 가족 연결 (M5-2): 부모 화면의 가족 코드 + 내 PIN
  hud.setFamily(welcome.family, welcome.parentOf);
  hud.familyBtn.addEventListener('click', async () => {
    const code = await askInput(root, { title: '가족 연결', sub: '아빠·엄마 화면(/family)에 있는 가족 코드 6자리를 넣어요', pattern: /^\d{6}$/, invalid: '숫자 6자리예요', placeholder: '가족 코드 6자리', maxLength: 6, okLabel: '다음' });
    if (!code) return;
    const pin = await askPin(root, '내 PIN', '내 계정이 맞는지 PIN 4자리로 확인해요', '연결', '취소');
    if (!pin) return;
    try {
      const linked = await net.linkFamily(code, pin);
      hud.setFamily(linked);
      hud.toast('가족에 연결됐어요! 아빠·엄마 화면에 내 이름이 보여요', 5000);
    } catch (e) {
      hud.toast((e as Error).message || '연결할 수 없어요', 5000);
    }
  });
  hud.chatBtn.addEventListener('click', () => (chat.visible ? closeChat() : openChat()));
  window.addEventListener('keydown', (e) => {
    if (!started || disconnected) return;
    if (e.code === 'KeyE') {
      if (bag.visible) closeBag();
      else if (!chat.visible && !hud.overlayVisible && !hud.helpVisible && !hud.resultVisible) openBag();
      e.preventDefault();
    } else if (e.code === 'KeyT') {
      if (chat.visible) closeChat();
      else if (!bag.visible && !hud.overlayVisible && !hud.helpVisible && !hud.resultVisible) openChat();
      e.preventDefault();
    } else if (e.code === 'Escape' && (bag.visible || chat.visible)) {
      closeBag();
      closeChat();
    }
  });

  hud.onOverlayClick = () => {
    if (disconnected) {
      window.location.reload();
      return;
    }
    if (!started) return;
    resume();
  };
  // 게임 방법 창: 열리면 입력을 멈추고, 닫히면 (게임 중이었다면) 다시 시작
  hud.onHelpToggle = (open) => {
    if (open) {
      input.paused = true;
      kbm.enabled = false;
    } else if (started && !hud.overlayVisible && !hud.resultVisible) {
      resume();
    }
  };
  document.addEventListener('pointerlockchange', () => {
    if (isTouch || !started || kbm.lockFailed || disconnected) return;
    if (!kbm.locked && !hud.overlayVisible && !hud.helpVisible && !hud.resultVisible && !hud.actionVisible && !bag.visible && !chat.visible) pause();
  });
  // HUD 가 캔버스를 덮고 있으므로 root 에서 듣는다 (오버레이 없이 잠금이 풀린 경우 대비)
  root.addEventListener('click', (e) => {
    if ((e.target as HTMLElement | null)?.closest('.action-card, .result-panel, .bag-panel, .chat-panel, .side-btns')) return;
    if (started && !isTouch && !kbm.locked && !hud.overlayVisible && !hud.resultVisible && !bag.visible && !chat.visible) resume();
  });

  // ---- 루프 ----
  let running = false;
  let last = performance.now();
  let fpsFrames = 0,
    fpsTime = 0,
    fps = 0,
    debugTimer = 0,
    drawCalls = 0,
    triangles = 0,
    sizeCheck = 0,
    moveAcc = 0;
  const bobStrength = isTouch ? 0.6 : 1;

  function sendMove(): void {
    if (!net.connected) return;
    const player = ctx.player;
    const flags = (player.sneaking ? FLAG_SNEAK : 0) | (player.sprinting ? FLAG_SPRINT : 0) | (player.onGround ? FLAG_GROUND : 0) | (player.inWater ? FLAG_WATER : 0);
    net.sendMove({ x: player.pos.x, y: player.pos.y, z: player.pos.z, yaw: player.yaw, pitch: player.pitch, flags });
  }

  /** 원정 경과 초 (서버 시각 보정) */
  const elapsedSec = () => (ctx.expedition ? (performance.now() - ctx.localStart) / 1000 : 0);

  /** PC 는 마우스가 잠겨 있어 버튼을 못 누른다 → Enter 키 (E 는 가방) */
  const KEY_HINT = isTouch ? '' : '  (Enter)';
  const onActionKey = (e: KeyboardEvent) => {
    if (e.code !== 'Enter' && e.code !== 'NumpadEnter') return;
    if (!started || !hud.actionVisible || hud.resultVisible || hud.overlayVisible || hud.helpVisible) return;
    e.preventDefault();
    hud.triggerAction();
  };
  window.addEventListener('keydown', onActionKey);

  /** 포탈 안에 서 있으면 카드 */
  const updatePortalCard = () => {
    const p = ctx.player.pos;
    const inside = portalContains(ctx.portalPos, p.x, p.y, p.z);
    if (!inside) {
      if (hud.actionVisible) hud.hideAction();
      return;
    }
    if (ctx.kind === 'village') {
      const def = EXPEDITIONS.require(FIRST_EXPEDITION);
      if (expeditionState) {
        const m = Math.floor(expeditionState.remainingSec / 60);
        hud.showAction(`${expeditionState.name} 원정 중`, `${expeditionState.players}명이 나가 있어요 · 약 ${m}분 남음`, '따라가기' + KEY_HINT, () => net.sendStartExpedition(expeditionState!.id));
      } else {
        hud.showAction(`${def.name}으로 원정`, `${Math.round(def.durationSec / 60)}분 · ${Math.round(def.nightStartsAt / 60)}분 뒤 밤 · 보물 상자 ${def.treasures}개\n포탈로 돌아오면 모은 것을 가져와요`, '원정 출발' + KEY_HINT, () => net.sendStartExpedition(FIRST_EXPEDITION));
      }
    } else {
      hud.showAction('마을로 돌아가기', '지금까지 모은 것을 마을 창고에 넣어요', '돌아가기' + KEY_HINT, () => net.sendReturnHome());
    }
  };

  const debugText = (): string => {
    const player = ctx.player;
    const p = player.pos;
    const yawDeg = ((player.yaw * 180) / Math.PI + 360) % 360;
    const facing = FACING[Math.round(yawDeg / 45) % 8];
    const t = ctx.interaction.target;
    const tgt = t ? `${registry.get(t.id).name} (${t.x}, ${t.y}, ${t.z}) 면 ${['+X', '-X', '+Y', '-Y', '+Z', '-Z'][t.face]}` : '없음';
    const exp = ctx.expedition ? `원정 ${ctx.expedition.name} 시드 ${ctx.expedition.seed} 경과 ${elapsedSec().toFixed(0)}s 하늘 ${skyLevel.toFixed(2)}` : `마을 ${welcome.village.code} 시드 ${welcome.village.seed}`;
    return [
      `FPS ${fps}  프레임 ${quality.ema.toFixed(1)}ms  해상도 ×${quality.pixelRatio.toFixed(2)}  렌더거리 ${ctx.chunks.renderDistance}  화면 ${sizeW}×${sizeH} 버퍼 ${renderer.domElement.width}×${renderer.domElement.height} 비율 ${camera.aspect.toFixed(2)}`,
      `드로우 ${drawCalls}  삼각형 ${(triangles / 1000).toFixed(1)}k`,
      `청크 보임 ${ctx.chunks.stats.visibleChunks}  큐 ${ctx.chunks.queued}  진행 ${ctx.chunks.inflight}  워커 ${pool.size}`,
      `메싱 최근 ${ctx.chunks.stats.lastMs.toFixed(1)}ms  평균 ${ctx.chunks.stats.avgMs.toFixed(1)}ms  최대 ${ctx.chunks.stats.maxMs.toFixed(1)}ms  총 ${ctx.chunks.stats.meshed}`,
      `위치 ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)}  yaw ${yawDeg.toFixed(0)}°  pitch ${((player.pitch * 180) / Math.PI).toFixed(0)}°  ${facing}`,
      `조준 ${tgt}`,
      `바닥 ${player.onGround ? 'O' : 'X'}  물 ${player.inWater ? 'O' : 'X'}  웅크림 ${player.sneaking ? 'O' : 'X'}  달리기 ${player.sprinting ? 'O' : 'X'}`,
      `빛 여기 하늘 ${ctx.light.skyAt(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))} 블록 ${ctx.light.blockAt(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))}  조명 처음 ${ctx.light.stats.initialMs.toFixed(0)}ms  최근 ${ctx.light.stats.lastFlushMs.toFixed(1)}ms/${ctx.light.stats.lastFlushCells}칸  지형 생성 ${ctx.genMs.toFixed(0)}ms  청크 ${ctx.world.chunkCount}`,
      `${isTouch ? '터치' : 'PC'}  ${navigator.hardwareConcurrency ?? '?'}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio || 1).toFixed(1)}`,
      `서버 ${net.connected ? `연결됨 왕복 ${net.rtt}ms` : '끊김'}  나 #${myIdx}  같이 ${remote.count}명  블록 대기 ${pending.size}  ${exp}`,
      `가방 ${inv.filter(Boolean).length}/${inv.length}칸  손 ${hud.selectedItem ?? '빈 손'}`,
    ].join('\n');
  };

  const frame = (now: number) => {
    if (!running) return;
    requestAnimationFrame(frame);
    tick(now, true);
  };

  /** 한 프레임. render=false 면 화면은 안 그린다 (테스트·숨김 탭용) */
  const tick = (now: number, render: boolean) => {
    // 시계가 뒤로 가면(테스트용 tick 과 rAF 가 섞일 때 등) 0 으로 — 음수 dt 는 물리 누적을 되감는다
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
    last = Math.max(last, now);
    const { player, interaction, chunks, light } = ctx;

    // 안전망: 15프레임마다 크기 재확인 (이벤트를 놓쳐도 0.25초 안에 복구)
    if ((sizeCheck = (sizeCheck + 1) % 15) === 0) applySize();

    const inp = input.frame(dt);
    if (inp.toggleDebug) debugVisible = !debugVisible;
    if (inp.slotDelta !== 0) hud.selectDelta(inp.slotDelta);
    if (inp.slotSelect >= 0) hud.select(inp.slotSelect);
    interaction.selectedBlock = heldBlock();

    player.update(inp, dt);
    interaction.update(inp, dt);
    player.applyToCamera(camera, bobStrength);

    // 위치는 20Hz 로 서버에
    moveAcc += dt * 1000;
    if (started && moveAcc >= MOVE_SEND_MS) {
      moveAcc = 0;
      sendMove();
    }
    remote.update(dt);

    // 이 프레임에 바뀐 블록들의 빛을 한 번에 다시 계산 → 빛이 바뀐 청크도 다시 메싱
    chunks.markDirtyAll(light.flush());

    if (interaction.target) {
      highlight.setTarget(interaction.target.x, interaction.target.y, interaction.target.z);
      highlight.setProgress(interaction.progress);
    } else highlight.clearTarget();
    hud.setProgress(interaction.progress);
    hud.setHeading(player.yaw);
    if (started) updatePortalCard();
    if (bag.visible && (stationTimer += dt * 1000) >= STATION_CHECK_MS) {
      stationTimer = 0;
      bag.setStations(scanStations());
    }

    // 원정: 타이머·낮밤
    if (ctx.expedition) {
      const e = ctx.expedition;
      const el = elapsedSec();
      const remaining = Math.max(0, e.durationSec - el);
      const phase: ExpeditionPhase = phaseAt(e, el);
      hud.setTimer(remaining, phase);
      applySky(Math.max(NIGHT_SKY, skyLightAt(e, el)));
      if (!warned3 && remaining <= 180 && remaining > 60) {
        warned3 = true;
        hud.toast('3분 남았어요! 포탈로 돌아가요', 5000);
      }
      if (!warned1 && remaining <= 60) {
        warned1 = true;
        hud.toast('1분! 지금 돌아가지 않으면 절반만 가져가요', 6000);
      }
    }

    chunks.update(player.pos.x, player.pos.y, player.pos.z);
    materials.setTime(now / 1000);
    sky.update(camera.position);
    ctx.portal.update(now / 1000);
    hand.setBlock(heldBlock());
    const walking = player.onGround && player.horizontalSpeed > 0.4 ? Math.min(1, player.horizontalSpeed / 4.3) : 0;
    hand.update(dt, camera, player.walkCycle, walking);

    if (render) {
      renderer.clear();
      renderer.render(scene, camera);
      // 손 렌더가 info 를 덮어쓰기 전에 월드 통계를 잡아 둔다
      drawCalls = renderer.info.render.calls;
      triangles = renderer.info.render.triangles;
      hand.render(renderer, camera);
      quality.frame(dt);
    }

    fpsFrames++;
    fpsTime += dt;
    if (fpsTime >= 0.5) {
      fps = Math.round(fpsFrames / fpsTime);
      fpsFrames = 0;
      fpsTime = 0;
    }
    debugTimer += dt;
    if (debugVisible && debugTimer >= 0.25) {
      debugTimer = 0;
      hud.setDebug(debugText());
    } else if (!debugVisible) hud.setDebug(null);
  };

  // 로딩 중에도 청크는 미리 메싱되도록 루프를 바로 돌린다
  running = true;
  requestAnimationFrame(frame);

  if (import.meta.env.DEV) {
    // 개발 콘솔에서 들여다보기: __dv.ctx.player.pos 등
    (window as unknown as { __dv: unknown }).__dv = {
      get ctx() {
        return ctx;
      },
      get world() {
        return ctx.world;
      },
      get player() {
        return ctx.player;
      },
      get chunks() {
        return ctx.chunks;
      },
      get light() {
        return ctx.light;
      },
      get interaction() {
        return ctx.interaction;
      },
      registry,
      camera,
      scene,
      renderer,
      pool,
      hud,
      quality,
      hand,
      highlight,
      net,
      remote,
      pending,
      welcome,
      input,
      kbm,
      startExpedition: (id = FIRST_EXPEDITION) => net.sendStartExpedition(id),
      get inv() {
        return inv;
      },
      bag,
      chat,
      openBag,
      openChat,
      returnHome: () => net.sendReturnHome(),
      /** rAF 없이 프레임을 돌린다 (숨겨진 탭에서의 자동 테스트용) */
      tick: (dtSec: number, render = false) => tick(last + dtSec * 1000, render),
    };
  }

  hud.showOverlay(
    `${welcome.village.name}`,
    (isTouch ? '왼쪽 아래 스틱: 움직이기  ·  드래그: 둘러보기\n짧게 탭: 놓기  ·  꾹: 부수기' : 'WASD 이동  ·  마우스 둘러보기\n좌클릭 꾹: 부수기  ·  우클릭: 놓기') +
      `\n마을 코드 ${welcome.village.code}`,
    isTouch ? '탭해서 시작' : '클릭해서 시작',
  );

  return {
    start() {
      if (started) return;
      started = true;
      const others = remote.count;
      hud.toast(others > 0 ? `마을에 들어왔어요. 지금 ${others}명이 함께 있어요` : '마을에 들어왔어요. 친구에게 마을 코드를 알려 주세요', 4000);
      if (isTouch) {
        if (fullscreenAvailable) void enterFullscreen();
        else if (!standalone) hud.toast(IOS_HINT, 7000);
        if (window.innerHeight > window.innerWidth && (fullscreenAvailable || standalone)) hud.toast('폰을 가로로 돌리면 더 편해요', 3500);
      }
      sendMove();
      resume();
    },
    dispose() {
      running = false;
      net.close();
      input.dispose();
      disposeWorld(ctx);
      pool.dispose();
      sky.dispose();
      highlight.dispose();
      hand.dispose();
      remote.dispose();
      materials.dispose();
      atlas.texture.dispose();
      renderer.dispose();
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onActionKey);
      bag.el.remove();
      chat.sheet.remove();
      chat.log.remove();
      sizeObserver?.disconnect();
      root.innerHTML = '';
    },
  };
}
