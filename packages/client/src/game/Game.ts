import {
  AIR_ID,
  FLAG_RIDING,
  GROUND_Y,
  type NestDragonInfo,
  type RidingInfo,
  HIT_COOLDOWN_MS,
  HIT_REACH,
  toolOf,
  STORAGE_REACH,
  beamOf,
  siteCenter,
  siteOf,
  staminaAt,
  staminaMaxFor,
  SADDLE_ITEM,
  nestContains,
  COSMETIC_KO,
  unlockedBetween,
  xpProgress,
  type TodayCard,
  canStartExpedition,
  expeditionNeedMin,
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
  expeditionUnlocked,
  generateExpedition,
  generateVillage,
  hasGenerator,
  itemName,
  phaseAt,
  portalContains,
  skyLightAt,
  BOSS_EMOJI,
  EXPEDITION_BOSS_KINDS,
  MOB_KIND_OF,
  type MobKind,
  FLAG_POLE,
  RAID_CAPTURE_SEC,
  type RaidStateInfo,
  ANIMAL_FLAG,
  ANIMAL_ID_BASE,
  type Equipment,
  armorTotals,
  bowOf,
  equipSlotOf,
  sanitizeEquipment,
  GUARD_RESEND_MS,
  GUARD_TAP_MS,
  isPotionItem,
  potionFromItemId,
} from '@dragon-village/shared';
import { BLOCKS, BUILDINGS, COMBAT, DRAGONS, PET_NAMES, EXPEDITIONS, FAMILY_RULES, ITEM_NAMES, MOBS, PHRASES, POTIONS, RAIDS, RECIPES, TOOLS, XP } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { beam as beamSound, bell, ding, explosion as explosionSound, hit as hitSound, hurt as hurtSound, levelUp, lose, roar } from '../audio/sound';
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
import { PetNamePicker } from '../ui/petNames';
import { ChestView } from '../ui/chest';
import { Hud, type HotbarSlot } from '../ui/hud';
import { NestView } from '../ui/nest';
import { MountView, NestDragons } from '../render/DragonMesh';
import { BeamView } from '../render/BeamView';
import { StorageView } from '../ui/storageView';
import { OrbView } from '../render/OrbView';
import { Particles, canvasAverageColor } from '../render/Particles';
import { MobView } from '../render/MobView';
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
/** 한국어 조사 (으)로: 받침 없음·ㄹ 받침이면 '로', 아니면 '으로' (초원 섬으로 · 동굴로) */
function toward(name: string): string {
  const code = name.charCodeAt(name.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return '로';
  const tail = code % 28;
  return tail === 0 || tail === 8 ? '로' : '으로';
}

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
  // 둥지의 드래곤들 (M6-3): 서버 자리대로 복셀 드래곤
  const nestDragons = new NestDragons(scene);
  nestDragons.sync(welcome.nestDragons);
  let nestDragonList: NestDragonInfo[] = welcome.nestDragons;
  // 탑승 (M6-4): 내가 탄 드래곤은 서버가 mount/dismount 로 알려 준다. 세계를 바꿔도(원정) 그대로 타고 간다
  /** 타고 있는 드래곤. 다시 들어올 때 서버가 준 것으로 시작 (#103 — 탑승 유지) */
  let myRiding: RidingInfo | null = welcome.spawn.riding ?? null;
  // 첫 걸음 안내 (M8-3): 처음 들어온 사람을 포탈 → 원정 출발 → 귀환까지 데려간다. 진행은 이 기기에 남긴다(새로고침해도 이어짐)
  const GUIDE_KEY = 'dv.guide';
  const GUIDE_TEXT: Record<number, string> = {
    1: '① 나침반의 금색 점을 따라 북쪽 포탈로 가요',
    2: '② 포탈 안에 서서 "원정 출발" 을 눌러요',
    3: '③ 블록을 꾹 눌러 모아요 · 6분 뒤엔 밤! 가운데 포탈로 돌아와요',
  };
  let guideStep = (() => {
    try {
      const v = localStorage.getItem(GUIDE_KEY);
      if (v === 'done') return 0;
      if (v) return Number(v) || 0;
    } catch {
      /* 저장 못 하는 브라우저 */
    }
    return welcome.first ? 1 : 0;
  })();
  const setGuideStep = (s: number) => {
    guideStep = s;
    try {
      localStorage.setItem(GUIDE_KEY, s === 0 ? 'done' : String(s));
    } catch {
      /* 무시 */
    }
    hud.setGuide(GUIDE_TEXT[s] ?? null);
  };
  /** 펫 목록 (#109): id → {이름, 내 것}. 조준하면 카드로 이름 짓기 */
  const pets = new Map<number, { name: string | null; mine: boolean }>();
  /** 원정에 따라온 펫 (#145·#147): 서버가 몹 목록에 같이 실어 움직이고 물게 한다. 여기선 이름표·토스트만 */
  const companions = new Map<number, { name: string | null; owner: number }>();
  const refreshPetNames = () => mobView.setPetNames([...[...pets.entries()].map(([id, p]) => ({ id, name: p.name, mine: p.mine })), ...[...companions.entries()].map(([id, c]) => ({ id, name: c.name, mine: c.owner === myIdx }))]);
  let aimedMobNow: number | null = null;
  const petNamer = new PetNamePicker(
    root,
    PET_NAMES.names,
    (id, name) => net.sendNameMob(id, name),
    () => {
      // 시트가 닫히면 게임 입력을 다시 켠다 (채팅 시트와 같다) — 아빠 2026-09-26 "버튼이 안 눌림"
      if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
    },
  );
  /** 내 장비 (M8-2): 서버가 준 것으로 시작, equip 이벤트로 바뀐다 */
  let myEquip: Equipment = sanitizeEquipment(COMBAT, welcome.spawn.equip ?? null);
  /** 로비 미리보기가 다음에 입은 갑옷을 그리도록 이 기기에 기억 (#139). 이름마다 따로 */
  const rememberEquip = () => {
    try {
      localStorage.setItem(`dv.equip:${welcome.spawn.nick}`, JSON.stringify(myEquip));
    } catch {
      /* 무시 */
    }
  };
  rememberEquip();
  /** 🛡️ 막기 (#118): 서버에 보낸 상태·시각 */
  let guardSent = false;
  let guardSentAt = 0;
  let guarding = false;
  /** 한 번 톡 누르면 이 시각까지는 막는다 (아들 13차, GUARD_TAP_MS) */
  let guardTapUntil = 0;
  let guardHeldPrev = false;
  /** 활 당기기 (#119): 누르기 시작한 시각, 진행 0~1 */
  let drawStart: number | null = null;
  let drawProgress = 0;
  const mount = new MountView(scene);
  // 빔 (M6-5): 서버가 확정한 것만 그린다. 기력은 서버 값 사이를 회복 공식으로 채워 바가 부드럽게 찬다
  const beams = new BeamView(scene);
  // 체력·구슬 (M7-1): 서버가 진실. 하트는 welcome 값으로 시작
  const orbView = new OrbView(scene);
  /** 블록 부스러기 (캐는 중 톡톡, 부서지면 와르르) */
  const particles = new Particles(scene);
  const blockColorCache = new Map<number, number>();
  const blockColor = (num: number): number => {
    let c = blockColorCache.get(num);
    if (c === undefined) {
      c = canvasAverageColor(iconOf(registry.get(num).id, 16));
      blockColorCache.set(num, c);
    }
    return c;
  };
  let crumbAcc = 0;
  let hp = welcome.hp;
  /** 살아 있는 보스(거미 왕) 자리·체력 — 보스 바에 방향·거리, 나침반이 가리킨다 (아들 13차 "어디 있는지 못 찾겠다", #127) */
  let bossInfo: { x: number; z: number; hp: number; kind: MobKind } | null = null;
  // 원정 몹 (M7-2): 서버 상태를 그리고, 조준한 몹을 탭/클릭하면 때린다
  const mobView = new MobView(scene);
  let hitCooldown = 0;
  let stamina: { value: number; max: number; at: number; readyAt: number } | null = null;
  let serverClockOffset = 0; // 서버 now - 내 Date.now()
  const beamNeed = () => (myRiding ? beamOf(DRAGONS.require(myRiding.dragon)).stamina : 0);
  const refreshStamina = () => {
    if (!stamina || !myRiding) return;
    const now = Date.now() + serverClockOffset;
    const value = staminaAt({ value: stamina.value, at: stamina.at }, stamina.max, now);
    hud.setStamina(value, stamina.max, beamNeed(), Math.max(0, stamina.readyAt - now) / 1000);
  };
  const fireBeam = () => {
    if (!myRiding || !started || disconnected) return;
    net.sendSkill('beam');
  };

  // ---- HUD ----
  const hud = new Hud(root, isTouch);
  const nameOf = (id: string) => (id in STATION_KO ? STATION_KO[id as keyof typeof STATION_KO] : isPotionItem(id) ? POTIONS.displayName(potionFromItemId(id)!) : itemName(id, registry, ITEM_NAMES)); // 물약은 potions.json 이름 (#163)
  const iconOf = (id: string, size: number): HTMLCanvasElement | null => itemIcon(id, size, registry, atlas, nameOf(id));
  remote.iconOf = (id) => iconOf(id, 32); // 다른 사람 손에 든 것 (#96)
  let sentHeld: string | null | undefined; // 서버에 마지막으로 알린 손 아이템

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
  // 마을 상태 (M6-6): 건물·레벨·도감은 서버가 진실
  let villageState = welcome.village_state ?? { built: [], level: 1, codex: 0, codexIds: [], eggSlots: 4 };
  /** 마을 방어전 상태 (M7-5). null = 없음 */
  let raidState: RaidStateInfo | null = null;
  /** 마지막으로 안내한 조준 몹 (M8-1) */
  let aimHintFor: number | null = null;
  let raidPhaseSeen: string | null = null;
  /** 출발 카드에서 고른 원정지 (열린 것 중 차례, M7-3) */
  let expeditionPick = 0;
  const openExpeditions = () => EXPEDITIONS.v1().filter((d) => hasGenerator(d.generator) && expeditionUnlocked(d.unlockedBy, villageState.built));
  let codexBlocks = new Set<string>(villageState.codexIds);
  const updateVillageInfo = () => {
    const exp = expeditionState ? ` · 원정 중: ${expeditionState.name} ${expeditionState.players}명` : '';
    hud.setVillageInfo(`마을 "${welcome.village.name}" 레벨 ${villageState.level} · 코드 ${welcome.village.code} · 지금 ${remote.count + 1}명${exp} (친구에게 코드를 알려 주면 같은 마을에 들어와요)`);
    // 따라가기 띠 (M9-3, #150): 마을에 있고 누가 원정 중이며 1분 넘게 남았으면 포탈까지 안 가도 바로 따라간다
    const s = expeditionState;
    if (ctx.kind === 'village' && s && s.players > 0 && s.remainingSec > 60) hud.setFollow(`${s.name} 원정 중 · ${s.players}명 · 약 ${Math.max(1, Math.round(s.remainingSec / 60))}분 남음`, () => net.sendStartExpedition(s.id));
    else hud.setFollow(null);
  };

  // ---- 가방 화면·채팅 (M4) ----
  // 드래곤 (M6-2): 내 목록·둥지 자리는 서버가 진실
  let myDragons = welcome.dragons;
  let nestSlots = welcome.nest;
  const bag = new BagView(root, {
    recipes: RECIPES,
    potions: POTIONS,
    dragons: DRAGONS,
    owned: () => new Set(myDragons.filter((d) => d.stage !== 'egg').map((d) => d.dragon)),
    codexBlocks: () => codexBlocks,
    codexCandidates: () => registry.defs.filter((d) => !d.internal && d.id !== 'air' && d.textures).map((d) => [d.id, d.name] as [string, string]),
    icon: iconOf,
    nameOf,
    onMove: (from, to, count) => net.sendInvMove(from, to, count),
    onDrop: (slot, count) => net.sendInvDrop(slot, count),
    onCraft: (recipe) => net.sendCraft(recipe),
    equipment: () => myEquip,
    equipSlotOf: (item) => equipSlotOf(COMBAT, item),
    armorDefense: () => armorTotals(COMBAT, myEquip).defense,
    onEquip: (slot) => net.sendEquip(slot),
    onUnequip: (part) => net.sendUnequip(part),
    onBrew: (bottles, ingredient) => {
      net.sendBrew(bottles, ingredient);
      bag.clearBrewSelection();
    },
    onClose: () => closeBag(),
  });
  bag.setInventory(inv);
  const nest = new NestView(root, {
    dragons: DRAGONS,
    xp: XP,
    nameOf,
    onPlace: (slot, item) => net.sendPlaceEgg(slot, item),
    onHatch: (id) => net.sendHatch(id),
    onFeed: (id, item) => net.sendFeed(id, item),
    onRide: (id) => {
      net.sendRide(id);
      closeNest();
    },
    onClose: () => closeNest(),
    eggSlots: () => villageState.eggSlots,
  });
  nest.setInventory(inv);
  nest.setDragons(myDragons);
  nest.setNest(nestSlots, welcome.nestDragons);
  nest.setXp(welcome.xp);
  // 마을 창고·건물 (M6-6): 창고 건물 옆에서. 서버가 진실
  const storageView = new StorageView(root, {
    buildings: BUILDINGS,
    icon: iconOf,
    nameOf,
    onMove: (item, count, dir) => net.sendStorageMove(item, count, dir),
    onBuild: (id) => net.sendBuild(id),
    onClose: () => closeStorage(),
  });
  storageView.setInventory(inv);
  storageView.setStorage(welcome.storage ?? []);
  storageView.setVillage(villageState.built, villageState.level, villageState.codex);
  // 상자 (#84): 서버가 진실. 탭하면 열리고, 옮기기는 요청만 보낸다
  const chest = new ChestView(root, {
    icon: iconOf,
    nameOf,
    onMove: (from, to, count) => {
      const at = chest.position;
      if (at) net.sendChestMove(at.x, at.y, at.z, from, to, count);
    },
    onClose: () => closeChest(),
  });
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
    // 대장간 (2026-09-24): 마을에 지어져 있고 그 자리 가운데 7칸 안이면
    const forge = siteOf('forge');
    if (ctx.kind === 'village' && forge && villageState.built.includes('forge')) {
      const c = siteCenter(forge);
      if (Math.hypot(p.x - c.x, p.z - c.z) <= STORAGE_REACH) out.forge = true;
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
    net.sendBlockChange({ seq, x, y, z, id: registry.get(newNum).id, slot: hud.selectedIndex });
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
    const gen = kind === 'expedition' && expedition ? generateExpedition(EXPEDITIONS.require(expedition.id), registry, expedition.seed) : generateVillage(registry, welcome.village.seed);
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
    player.riding = myRiding !== null;
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
        particles.burst(x, y, z, blockColor(prev));
      },
      onHint: (text) => hud.toast(text, 2000),
      onOpenChest: (bx, by, bz) => {
        if (bag.visible || nest.visible || chat.visible) return;
        net.sendOpenChest(bx, by, bz);
      },
    });
    const portalPos = 'layout' in gen ? gen.layout.portal : gen.portal;
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
    companions.clear(); // 세계가 바뀌면 따라온 펫 목록은 서버가 다시 준다 (#145)
    ctx = buildWorld(w.kind, w.expedition, { ...w.spawn }, w.chunks);
    // 그 세계에 있는 사람들만 보인다
    for (const idx of remote.indices()) remote.remove(idx);
    for (const p of w.players) remote.upsert(p);
    nestDragons.visible = w.kind === 'village'; // 둥지 드래곤은 마을에서만
    touch.clearHolds();
    warned3 = warned1 = false;
    hud.hideAction();
    orbView.clear(); // 그 세계의 구슬은 서버가 곧 보내 준다
    mobView.clear();
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
  let endedByTime = false;
  // 경험치 (M6-1): 서버가 진실, 클라는 더하며 연출. 레벨·바는 공식으로
  let xpTotal = welcome.xp;
  hud.setXp(xpTotal);
  const onXp = (total: number, orbAt: { x: number; y: number; z: number } | null, amount: number) => {
    const before = xpProgress(xpTotal).level;
    xpTotal = total;
    hud.setXp(xpTotal);
    nest.setXp(xpTotal);
    if (orbAt) {
      const v = new THREE.Vector3(orbAt.x, orbAt.y, orbAt.z).project(camera);
      const w = renderer.domElement.clientWidth,
        h = renderer.domElement.clientHeight;
      const onScreen = v.z < 1 && Math.abs(v.x) <= 1.1 && Math.abs(v.y) <= 1.1;
      const sx = onScreen ? ((v.x + 1) / 2) * w : w / 2,
        sy = onScreen ? ((1 - v.y) / 2) * h : h * 0.55;
      // 귀환 직후엔 세계를 바꾸느라 화면이 잠깐 멈추므로 조금 뒤에 띄운다
      window.setTimeout(() => {
        hud.xpOrbs(sx, sy, Math.min(10, 3 + Math.ceil(amount / 2)), amount);
        ding();
      }, 350);
    }
    const after = xpProgress(xpTotal).level;
    if (after > before) {
      levelUp();
      const unlocked = unlockedBetween(XP, before, after);
      hud.toast(unlocked.length ? `레벨 ${after}! ${unlocked.map((u) => COSMETIC_KO[u.id] ?? u.id).join('·')} 열렸어요` : `레벨 ${after}!`, 4000);
    }
  };
  /** 아이의 오늘 카드 (M5-3/4). 아이가 아니면 null */
  let todayCard = welcome.today;
  /** 카드가 갱신될 때: 표시 + (제한이 켜져 있을 때) 5분·1분 경고, 차단 5분 전 경고 */
  const onTodayCard = (card: TodayCard) => {
    const prev = todayCard;
    todayCard = card;
    hud.setToday(card);
    // 승인·자동 승인으로 보너스가 늘면 "+N분!" (제한 여부와 상관없이)
    if (prev && card.bonusMin > prev.bonusMin) hud.toast(`+${card.bonusMin - prev.bonusMin}분! 할 일이 확인됐어요`, 5000);
    if (!card.enforced || !prev) return;
    if (prev.remainingMin > 5 && card.remainingMin <= 5 && card.remainingMin > 1) hud.toast(`오늘 게임 시간이 ${card.remainingMin}분 남았어요`, 6000);
    else if (prev.remainingMin > 1 && card.remainingMin === 1) hud.toast('1분 남았어요 — 곧 마을에서 나가요. 내일 다시!', 8000);
    if (prev.minutesUntilBlocked > 5 && card.minutesUntilBlocked <= 5 && card.minutesUntilBlocked > 0) hud.toast(`${card.minutesUntilBlocked}분 뒤에 게임 시간이 끝나요`, 6000);
  };
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
          const other = dPrev ? registry.doorVariant(dPrev.base, dPrev.facing, !dPrev.upper, dPrev.open, dPrev.hinge) : AIR_ID;
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
    onToday: (card) => onTodayCard(card),
    onDragons: (list) => {
      const before = myDragons.filter((d) => d.stage !== 'egg').length;
      const prevStage = new Map(myDragons.map((d) => [d.id, d.stage]));
      myDragons = list;
      nest.setDragons(list);
      const after = list.filter((d) => d.stage !== 'egg').length;
      if (after > before) {
        const d = list.filter((x) => x.stage !== 'egg').at(-1)!;
        hud.toast(`🐉 ${DRAGONS.find(d.dragon)?.name ?? d.dragon}이 태어났어요! 도감에 등록됐어요`, 6000);
      }
      for (const d of list) if (d.stage === 'adult' && prevStage.get(d.id) === 'baby') hud.toast(`🐲 ${DRAGONS.find(d.dragon)?.name ?? d.dragon}이 어른이 됐어요! 더 크고 무서워졌어요`, 6000);
    },
    onNest: (slots, dragons) => {
      nestSlots = slots;
      nestDragonList = dragons;
      nest.setNest(slots, dragons);
      nestDragons.sync(dragons);
    },
    onChest: (cx, cy, cz, slots) => {
      chest.setInventory(inv);
      chest.setChest(cx, cy, cz, slots);
      input.paused = true;
      kbm.enabled = false;
      if (kbm.locked) document.exitPointerLock();
    },
    onHeld: (idx, item) => {
      if (idx !== myIdx) remote.setHeld(idx, item);
    },
    onEquip: (m) => {
      if (m.idx !== myIdx) {
        remote.setEquip(m.idx, m.parts); // 다른 사람 인형에 갑옷 덧입히기
        return;
      }
      myEquip = sanitizeEquipment(COMBAT, m.parts);
      rememberEquip();
      hud.setArmor(m.defense);
      hud.setGuardAvailable(myEquip.shield !== null);
      bag.refresh();
    },
    onArrow: (m) => mobView.shot(m.from, m.to), // 스켈레톤·약탈자 화살
    onDragonHp: (m) => hud.setDragonHp(m.hp, m.max),
    onDragonDown: (m) => {
      const name = DRAGONS.find(m.dragon)?.name ?? m.dragon;
      hud.toast(`😵 ${name}이(가) 쓰러졌어요 — 둥지에서 ${Math.round((m.restUntil - (Date.now() + serverClockOffset)) / 60000)}분 쉬면 다시 탈 수 있어요`, 7000);
      lose();
    },
    onPets: (list) => {
      pets.clear();
      for (const p of list) pets.set(p.id, { name: p.name, mine: p.mine });
      refreshPetNames();
    },
    onCompanions: (list) => {
      // 새로 온 펫은 주인 옆에서 시작, 이미 있던 건 자리 유지, 목록에 없는 건 지운다 (#145)
      const seen = new Set<number>();
      for (const c of list) {
        seen.add(c.id);
        if (!companions.has(c.id) && c.owner === myIdx) hud.toast(`🐾 ${c.name ?? '강아지'}이(가) 따라왔어요 — 가까운 몹을 물어요`, 3000);
        companions.set(c.id, { name: c.name, owner: c.owner });
      }
      for (const id of [...companions.keys()]) if (!seen.has(id)) companions.delete(id);
      refreshPetNames();
    },
    onGuard: (m) => {
      if (m.idx !== myIdx) remote.setGuarding(m.idx, m.on);
    },
    onShot: (m) => {
      const to = mobView.positionOf(m.id);
      if (!to) return;
      const pl = ctx.player;
      const from = m.idx === myIdx ? { x: pl.eye.x + pl.lookDir.x * 0.6, y: pl.eye.y - 0.25, z: pl.eye.z + pl.lookDir.z * 0.6 } : m.from;
      mobView.shot(from, to);
    },
    onRaid: (s) => {
      raidState = s;
      if (!s) {
        hud.hideRaid();
        raidPhaseSeen = null;
        return;
      }
      if (s.phase !== raidPhaseSeen) {
        raidPhaseSeen = s.phase;
        if (s.phase === 'warning') bell();
        else if (s.phase === 'wave') roar();
        else if (s.phase === 'won') levelUp();
        else if (s.phase === 'lost') lose();
      }
      const mm = `${Math.floor(s.secLeft / 60)}:${String(s.secLeft % 60).padStart(2, '0')}`;
      if (s.phase === 'warning') hud.setRaid(`🔔 우민이 온다! ${s.warnLeft}초 · 깃대를 지켜요`);
      else if (s.phase === 'wave') hud.setRaid(`⚔️ 파도 ${s.wave}/${s.waves} · 우민 ${s.remaining} · ${mm}${s.capture > 0 ? ` · 🚩 깃대 ${s.capture}/${RAID_CAPTURE_SEC}` : ''}`, s.capture > 0);
      else if (s.phase === 'won') hud.setRaid('🏆 마을을 지켰다!');
      else hud.setRaid('💀 우민이 깃대를 차지했어요…', true);
    },
    onMount: (idx, riding) => {
      if (idx !== myIdx) {
        remote.setMount(idx, riding);
        return;
      }
      myRiding = riding;
      ctx.player.riding = true;
      mount.set(riding.dragon);
      hud.setRiding(true, DRAGONS.find(riding.dragon)?.skills.find((s) => s.type === 'beam')?.name ?? '빔');
      stamina = { value: staminaMaxFor('adult'), max: staminaMaxFor('adult'), at: Date.now() + serverClockOffset, readyAt: 0 };
      refreshStamina();
      hud.hideAction();
      hud.toast(`🐉 ${DRAGONS.find(riding.dragon)?.name ?? riding.dragon}을 탔어요! ${isTouch ? '▲ 위로 · ▼ 아래로' : 'Space 위로 · Shift 아래로'} · 내리기는 🐉 버튼`, 6000);
    },
    onDismount: (idx) => {
      if (idx !== myIdx) {
        remote.setMount(idx, null);
        return;
      }
      myRiding = null;
      ctx.player.riding = false;
      mount.set(null);
      hud.setRiding(false);
      stamina = null;
      touch.clearHolds(); // 내리면 잠긴 ▲▼ 는 풀어 준다
    },
    onStorage: (items) => {
      storageView.setStorage(items);
      if (!storageView.visible && pendingStorageOpen) {
        pendingStorageOpen = false;
        storageView.show();
        input.paused = true;
        kbm.enabled = false;
        if (kbm.locked) document.exitPointerLock();
      }
    },
    onVillage: (m) => {
      const before = villageState.level;
      villageState = { ...villageState, built: m.built, level: m.level, codex: m.codex, eggSlots: m.eggSlots };
      storageView.setVillage(m.built, m.level, m.codex);
      nest.setInventory(inv); // 알 자리 수가 바뀌었을 수 있다 — 열려 있으면 다시 그린다
      updateVillageInfo();
      if (m.level > before) hud.toast(`🏘️ 마을 레벨 ${m.level}! 광장 깃대에 깃발이 늘었어요`, 5000);
    },
    onCodex: (m) => {
      codexBlocks = new Set([...codexBlocks, m.id]);
      bag.setInventory(inv); // 도감 탭이 열려 있으면 다시 그린다
      hud.toast(`📖 새로 발견! ${nameOf(m.id)} — 마을 도감 ${m.total}종 (+${XP.ours.codexNewEntry})`, 4500);
    },
    onHealth: (m) => {
      if (m.hp < hp) {
        hud.hurtFlash();
        hurtSound();
        if (m.cause === 'poison') hud.toast('🕷️ 독에 물렸어요 — 잠깐 아파요', 1500);
      }
      if (m.cause === 'blocked') hud.toast('🛡️ 방패로 막았어요', 1200);
      hp = m.hp;
      hud.setHealth(m.hp, m.max);
    },
    onRespawn: (m) => {
      // 쓰러졌다 — 서버가 정한 자리(포탈 앞·광장)로. 가방은 그대로, 구슬은 그 자리에
      const pl = ctx.player;
      pl.pos.x = m.x;
      pl.pos.y = m.y;
      pl.pos.z = m.z;
      pl.vel.x = pl.vel.y = pl.vel.z = 0;
      sendMove();
      hud.toast(m.dropped > 0 ? `💀 쓰러졌어요… 경험치 구슬 ${m.dropped}개가 그 자리에 남았어요. 가서 되찾아요!` : '💀 쓰러졌어요… 다시 일어났어요', 6000);
    },
    onMobs: (list) => {
      mobView.setState(list);
      const boss = list.find((m) => EXPEDITION_BOSS_KINDS.includes(MOB_KIND_OF[m.kind] ?? 'zombie'));
      bossInfo = boss ? { x: boss.x, z: boss.z, hp: boss.hp, kind: MOB_KIND_OF[boss.kind] ?? 'spider_king' } : null; // 바 글자(방향·거리)는 프레임마다 아래에서
      if (!boss) hud.hideBoss();
    },
    onMobEvent: (m) => {
      mobView.event(m.ev, m.id, m.x, m.y, m.z, performance.now(), m.dmg);
      if (m.ev === 'explode') {
        hud.hurtFlash();
        explosionSound();
      } else if (m.ev === 'die') {
        ding();
        if (EXPEDITION_BOSS_KINDS.includes(m.mob as MobKind)) {
          hud.hideBoss();
          levelUp(); // 승리 팡파르 대신
        }
      } else if (m.ev === 'hit') hitSound();
      else if (m.ev === 'love' || m.ev === 'tame' || m.ev === 'grow' || m.ev === 'milk') ding();
      else if (m.ev === 'wake') {
        roar();
        hud.hurtFlash();
      } else if (m.ev === 'summon') roar();
    },
    onOrbs: (list) => orbView.set(list),
    onOrbGone: (id, by) => {
      orbView.remove(id);
      if (by === myIdx) ding();
    },
    onBeam: (m) => {
      beams.fire(m.from, m.dir, m.color, m.power, m.range);
      beamSound(m.power);
    },
    onStamina: (m) => {
      serverClockOffset = m.now - Date.now();
      stamina = { value: m.value, max: m.max, at: m.now, readyAt: m.readyAt };
      refreshStamina();
    },
    onXpGained: (m) => onXp(xpTotal + m.amount, { x: m.x, y: m.y, z: m.z }, m.amount),
    onXpState: (m) => onXp(m.total, null, 0),
    onTimeUp: (_reason, message) => {
      // 오늘은 여기까지 (제한이 켜져 있을 때만 온다). 서버가 곧 연결을 닫으니 그 전에 화면을 바꾼다
      endedByTime = true;
      disconnected = true;
      input.paused = true;
      kbm.enabled = false;
      hud.hideToday();
      hud.hideAction();
      hud.showOverlay('오늘은 여기까지!', message + '\n확인을 누르면 마을에서 나가요.', '확인'); // 확인 → 새로 고침(로비)
    },
    onApprovalAsk: (ask) => hud.showApproval(ask),
    onPending: (items) => hud.setPending(items),
    onClose: (reason) => {
      disconnected = true;
      input.paused = true;
      kbm.enabled = false;
      if (endedByTime) return; // 시간 종료 화면을 그대로 둔다
      // 서버가 보낸 이유(대문자 코드: KICKED·TIME_UP·NO_PLAY_TODAY…)면 사람이 눌러야 하고, 네트워크·서버 재시작이면 저절로 다시 잇는다 (#155)
      const policy = /^[A-Z_]+$/.test(reason) && reason !== 'SERVER_SHUTDOWN';
      if (policy) {
        hud.showOverlay('서버와 연결이 끊어졌어요', reason + '\n다시 들어가려면 아래를 눌러요.', '다시 연결');
        return;
      }
      hud.showOverlay('연결이 끊어졌어요', '서버가 다시 보이면 저절로 이어요… (바로 하려면 아래를 눌러요)', '다시 연결');
      reconnectWhenUp();
    },
    onWorldEnter: enterWorld,
    onExpeditionResult: (m) => {
      showResult(m);
      if (guideStep === 3) {
        setGuideStep(0);
        setTimeout(() => hud.toast('🎉 첫 원정 끝! 가져온 걸로 마을을 꾸며 봐요 — 게임 방법(?)에 더 많은 게 있어요', 7000), 1500);
      }
    },
    onExpeditionState: (s) => {
      const wasActive = !!expeditionState;
      expeditionState = s;
      if (!wasActive && s && ctx.kind === 'village') hud.toast(`${s.name} 원정이 시작됐어요! 위의 🧭 따라가기를 누르면 바로 같이 가요`, 5000);
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
      nest.setInventory(inv);
      chest.setInventory(inv);
      storageView.setInventory(inv);
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
  const IOS_HINT = '아이폰 사파리는 전체화면이 안 돼요.\n아래 가운데 공유(⬆️) 버튼 → "홈 화면에 추가" → 홈 화면의 드래곤 크래프트 아이콘으로 열면 전체화면이 돼요.';

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
  /** 가방·채팅·둥지·상자 — 창이 하나라도 열려 있으면 마우스를 잠그지 않는다. 상자가 빠져 있었다 (아빠 2026-09-23) */
  const anyPanelOpen = () => bag.visible || chat.visible || nest.visible || chest.visible || storageView.visible || petNamer.visible;
  // 창고 창 (M6-6): 서버가 재고를 보내 주면 연다 (열 자격도 서버가 본다)
  let pendingStorageOpen = false;
  const openStorage = () => {
    if (anyPanelOpen() || !started || disconnected) return;
    pendingStorageOpen = true;
    net.sendOpenStorage();
  };
  const closeStorage = () => {
    if (!storageView.visible) return;
    storageView.hide();
    if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
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
    if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
  };
  const openChat = () => {
    if (!started || disconnected || hud.resultVisible) return;
    input.paused = true;
    kbm.enabled = false;
    if (kbm.locked) document.exitPointerLock();
    chat.show();
  };
  // 펫 이름 시트 (#109): 채팅 시트처럼 입력을 멈추고 마우스 잠금을 풀어야 버튼이 눌린다
  const openPetNamer = (id: number, current: string | null) => {
    if (!started || disconnected || hud.resultVisible || anyPanelOpen()) return;
    hud.hideAction();
    input.paused = true;
    kbm.enabled = false;
    if (kbm.locked) document.exitPointerLock();
    petNamer.show(id, current);
  };
  const closeChest = () => {
    if (!chest.visible) return;
    chest.hide();
    if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
  };
  const closeChat = () => {
    if (!chat.visible) return;
    chat.hide();
    if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
  };
  // 둥지 창 (M6-2)
  const openNest = () => {
    if (anyPanelOpen()) return;
    nest.setXp(xpTotal);
    nest.setInventory(inv);
    nest.show();
    input.paused = true;
    kbm.enabled = false;
  };
  const closeNest = () => {
    if (!nest.visible) return;
    nest.hide();
    if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
  };
  hud.bagBtn.addEventListener('click', () => (bag.visible ? closeBag() : openBag()));
  hud.rideBtn.addEventListener('click', () => net.sendDismount());
  hud.skillBtn.addEventListener('click', fireBeam);
  // 오늘 카드 (M5-3): 아이면 남은 시간·할 일. 시간 제한은 걸지 않는다(표시만, 아빠 2026-09-19)
  hud.setToday(welcome.today);
  hud.setHealth(hp, 20); // 하트 (M7-1) — welcome 값으로 시작
  hud.setArmor(armorTotals(COMBAT, myEquip).defense); // 방어 바 (M8-2)
  hud.setGuide(GUIDE_TEXT[guideStep] ?? null); // 첫 걸음 (M8-3)
  hud.setGuardAvailable(myEquip.shield !== null); // 🛡️ 막기 버튼 (#118)
  ctx.player.guardSlow = COMBAT.shield.guardSlow;
  if (myRiding) {
    // 타고 있던 채로 들어왔다 (#103): 드래곤·빔 버튼·기력을 바로 켠다 (mount 이벤트는 처음 탈 때만 온다)
    mount.set(myRiding.dragon);
    hud.setRiding(true, DRAGONS.find(myRiding.dragon)?.skills.find((s) => s.type === 'beam')?.name ?? '빔');
    stamina = { value: staminaMaxFor('adult'), max: staminaMaxFor('adult'), at: Date.now() + serverClockOffset, readyAt: 0 };
    refreshStamina();
  }
  hud.onCheckTodo = (id) => net.sendCheckTodo(id);
  hud.onApprove = (ask, ok) => net.sendApproveTodo(ask.id, ask.date, ok);
  hud.setPending(welcome.pending);
  if (welcome.pending.length) hud.toast(`승인 기다리는 할 일이 ${welcome.pending.length}개 있어요 — 위의 ✅ 를 눌러 보세요`, 6000);
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
    } else if (e.code === 'KeyF' && myRiding && !anyPanelOpen() && !hud.overlayVisible) {
      fireBeam(); // PC: F 로 빔 (M6-5)
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

  /** 끊긴 뒤 서버 /health 가 살아나면 새로고침 — 로비는 dv.autojoin 표시를 보고 바로 들어간다 (#155) */
  let reconnecting = false;
  const reconnectWhenUp = () => {
    if (reconnecting) return;
    reconnecting = true;
    let tries = 0;
    const poll = async () => {
      tries++;
      try {
        const r = await fetch('/health', { cache: 'no-store' });
        if (r.ok) {
          try {
            sessionStorage.setItem('dv.autojoin', '1');
          } catch {
            /* 무시 */
          }
          window.location.reload();
          return;
        }
      } catch {
        /* 아직 안 살아남 */
      }
      setTimeout(poll, Math.min(10_000, 1500 + tries * 500));
    };
    setTimeout(poll, 1500);
  };
  hud.onOverlayClick = () => {
    if (disconnected) {
      try {
        sessionStorage.setItem('dv.autojoin', '1');
      } catch {
        /* 무시 */
      }
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
    } else if (started && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) {
      resume();
    }
  };
  document.addEventListener('pointerlockchange', () => {
    if (isTouch || !started || kbm.lockFailed || disconnected) return;
    if (!kbm.locked && !hud.overlayVisible && !hud.helpVisible && !hud.resultVisible && !hud.actionVisible && !anyPanelOpen()) pause();
  });
  // HUD 가 캔버스를 덮고 있으므로 root 에서 듣는다 (오버레이 없이 잠금이 풀린 경우 대비).
  // 창 안을 누른 것은 "게임으로 돌아가기"가 아니다 — 둥지 창이 빠져 있어서 먹이를 한 번 주면
  // 마우스가 다시 잠겨 버튼을 더 못 눌렀다 (아빠 2026-09-22). 상자 창은 .bag-panel 클래스를 같이 쓴다
  root.addEventListener('click', (e) => {
    if ((e.target as HTMLElement | null)?.closest('.action-card, .result-panel, .bag-panel, .chat-panel, .nest-panel, .side-btns')) return;
    if (started && !isTouch && !kbm.locked && !hud.overlayVisible && !hud.resultVisible && !anyPanelOpen()) resume();
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
    const flags = (player.sneaking ? FLAG_SNEAK : 0) | (player.sprinting ? FLAG_SPRINT : 0) | (player.onGround ? FLAG_GROUND : 0) | (player.inWater ? FLAG_WATER : 0) | (player.riding ? FLAG_RIDING : 0);
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

  /** 내 드래곤을 보고 있나 (M6-4): 5칸 안, 시선과 거의 일치. 가장 가까운 것 */
  const lookedDragon = (): NestDragonInfo | null => {
    const eye = ctx.player.eye;
    const dir = ctx.player.lookDir;
    let best: NestDragonInfo | null = null;
    let bestDist = 5;
    for (const d of nestDragonList) {
      if (!d.mine) continue;
      const dx = d.perch.x + 0.5 - eye.x,
        dy = d.perch.y + 0.6 - eye.y,
        dz = d.perch.z + 0.5 - eye.z;
      const dist = Math.hypot(dx, dy, dz);
      if (dist > bestDist || dist < 0.01) continue;
      const dot = (dx * dir.x + dy * dir.y + dz * dir.z) / dist;
      if (dot < 0.8) continue;
      best = d;
      bestDist = dist;
    }
    return best;
  };
  const hasSaddle = () => inv.some((s) => s !== null && s.item === SADDLE_ITEM);
  /** '알겠어요' 로 접어 둔 드래곤 (그 드래곤을 보는 동안만 유지) */
  let dismissedDragon: number | null = null;

  /** 포탈 안에 서 있으면 카드 */
  const updatePortalCard = () => {
    const p = ctx.player.pos;
    // 내 펫을 보고 있으면 이름 짓기 카드 (#109)
    if (aimedMobNow !== null && pets.get(aimedMobNow)?.mine && !petNamer.visible) {
      const pet = pets.get(aimedMobNow)!;
      const id = aimedMobNow;
      hud.showAction(`🐾 ${pet.name ?? '내 강아지'}`, pet.name ? '빈손 탭 → 앉기/일어나기 · 이름을 바꿀 수도 있어요' : '이름을 지어 줘요 (목록에서 골라요) · 빈손 탭 → 앉기/일어나기', (pet.name ? '이름 바꾸기' : '이름 짓기') + KEY_HINT, () => openPetNamer(id, pet.name));
      return;
    }
    const inside = portalContains(ctx.portalPos, p.x, p.y, p.z);
    if (!inside) {
      // 내 드래곤을 보고 있으면 타기 카드 (M6-4) — 둥지 카드보다 먼저
      if (ctx.kind === 'village' && !myRiding) {
        const d = lookedDragon();
        if (!d) dismissedDragon = null; // 다른 데를 보면 다시 뜬다
        if (d && d.id !== dismissedDragon) {
          const name = DRAGONS.find(d.dragon)?.name ?? d.dragon;
          // '알겠어요' 는 이 드래곤을 보는 동안만 접어 둔다 — 안 그러면 다음 프레임에 다시 떠서 눌러도 안 닫힌다 (아빠 2026-09-22)
          const dismiss = () => {
            dismissedDragon = d.id;
            hud.hideAction();
          };
          if (d.stage !== 'adult') hud.showAction(`${name} (아기)`, '어른이 되면 탈 수 있어요 — 둥지 창에서 먹이를 주면 빨리 자라요', '알겠어요', dismiss);
          else if (d.restingUntil && d.restingUntil > Date.now() + serverClockOffset) hud.showAction(`${name} 쉬는 중`, `쓰러져서 ${Math.max(1, Math.ceil((d.restingUntil - (Date.now() + serverClockOffset)) / 60000))}분 더 쉬어야 탈 수 있어요 · 둥지 창에서 먹이면 2분 빨라져요`, '알겠어요', dismiss);
          else if (!hasSaddle()) hud.showAction(`${name} 타기`, '안장이 있어야 해요 — 제작대: 가죽 5 + 철 2 (가죽은 원정 보물 상자)', '알겠어요', dismiss);
          else hud.showAction(`🐉 ${name} 타기`, isTouch ? '앞으로 밀면 보는 쪽으로 날아요 · ▲ 위로 · ▼ 아래로 · 🐉 버튼으로 내려요' : 'W 로 보는 쪽으로 날아요 · Space 위로 · Shift 아래로 · 🐉 버튼으로 내려요', '타기' + KEY_HINT, () => net.sendRide(d.id));
          return;
        }
      }
      // 창고 건물 옆 (M6-6): 광장 동쪽
      const st = siteOf('storage');
      if (ctx.kind === 'village' && st && Math.hypot(p.x - siteCenter(st).x, p.z - siteCenter(st).z) <= STORAGE_REACH) {
        hud.showAction('마을 창고', `마을 레벨 ${villageState.level} · 재료를 모아 건물을 지어요`, '창고 열기' + KEY_HINT, openStorage);
        return;
      }
      // 둥지 안 (M6-2): 광장 남쪽 집터
      if (ctx.kind === 'village' && nestContains(GROUND_Y, p.x, p.y, p.z)) {
        hud.showAction('드래곤 둥지', '알을 놓고, 레벨을 써서 부화시켜요', '둥지 열기' + KEY_HINT, openNest);
        return;
      }
      // 깃대 옆 (M7-5): 방어전 시작
      if (ctx.kind === 'village' && !raidState && Math.hypot(p.x - (FLAG_POLE.x + 0.5), p.z - (FLAG_POLE.z + 0.5)) <= 4) {
        const need = expeditionNeedMin(Math.ceil(RAIDS.durationSec / 60), FAMILY_RULES);
        if (todayCard?.enforced && !canStartExpedition(todayCard, Math.ceil(RAIDS.durationSec / 60), FAMILY_RULES)) {
          hud.showAction('오늘은 방어전은 쉬어요', `방어전은 ${need}분 필요해요`, '알겠어요', () => hud.hideAction());
          return;
        }
        if (villageState.level < RAIDS.minVillageLevel) hud.showAction('🔔 우민 방어전', `마을 레벨 ${RAIDS.minVillageLevel}부터 우민이 쳐들어와요 (지금 ${villageState.level})`, '알겠어요', () => hud.hideAction());
        else hud.showAction('🔔 우민 방어전', `${Math.round(RAIDS.durationSec / 60)}분 · 파도 ${RAIDS.waves}번 · 우민이 북쪽에서 깃대로 와요\n마을은 부서지지 않아요 · 일주일에 ${RAIDS.maxPerWeek}번`, '방어 시작' + KEY_HINT, () => net.sendStartRaid());
        return;
      }
      if (hud.actionVisible) hud.hideAction();
      return;
    }
    if (ctx.kind === 'village') {
      const open = openExpeditions();
      const def = open[expeditionPick % Math.max(1, open.length)] ?? EXPEDITIONS.require(FIRST_EXPEDITION);
      // 시간 제한 (M5-4): 남은 시간이 원정 길이 + 여유보다 적으면 오늘은 마을에서
      if (todayCard?.enforced && !canStartExpedition(todayCard, Math.ceil(def.durationSec / 60), FAMILY_RULES)) {
        const need = expeditionNeedMin(Math.ceil(def.durationSec / 60), FAMILY_RULES);
        const why = todayCard.noPlayToday ? '오늘은 게임 없는 날이에요' : todayCard.minutesUntilBlocked < todayCard.remainingMin ? `게임 시간이 ${todayCard.minutesUntilBlocked}분 뒤에 끝나요` : `남은 시간 ${todayCard.remainingMin}분`;
        hud.showAction('오늘은 마을에서 놀자', `${why} · 원정은 ${need}분 필요해요`, '알겠어요', () => hud.hideAction());
        return;
      }
      if (expeditionState) {
        const m = Math.floor(expeditionState.remainingSec / 60);
        hud.showAction(`${expeditionState.name} 원정 중`, `${expeditionState.players}명이 나가 있어요 · 약 ${m}분 남음`, '따라가기' + KEY_HINT, () => net.sendStartExpedition(expeditionState!.id));
      } else {
        const night = def.nightStartsAt > 0 ? `${Math.round(def.nightStartsAt / 60)}분 뒤 밤` : '처음부터 어두워요 · 몹이 바로 나와요';
        const alt = open.length > 1 ? { label: `다른 곳 ▸ ${open[(expeditionPick + 1) % open.length]!.name}`, onClick: () => void (expeditionPick = (expeditionPick + 1) % open.length) } : undefined;
        hud.showAction(`${def.name}${toward(def.name)} 원정`, `${Math.round(def.durationSec / 60)}분 · ${night} · 보물 상자 ${def.treasures}개\n포탈로 돌아오면 모은 것을 가져와요`, '원정 출발' + KEY_HINT, () => net.sendStartExpedition(def.id), alt);
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
    hud.tickEffects(dt);
    if (inp.toggleDebug) debugVisible = !debugVisible;
    if (inp.slotDelta !== 0) hud.selectDelta(inp.slotDelta);
    if (inp.slotSelect >= 0) hud.select(inp.slotSelect);
    interaction.selectedBlock = heldBlock();
    interaction.heldItem = hud.selectedItem;

    player.update(inp, dt);
    // 몹을 조준하고 있으면 탭/클릭은 때리기 (블록은 안 부순다)
    hitCooldown = Math.max(0, hitCooldown - dt);
    // 활·쇠뇌를 들었으면 멀리 있는 몹도 노린다 (M8-2)
    const bow = bowOf(COMBAT, hud.selectedItem);
    const aimedMob = mobView.count > 0 ? mobView.aim(player.eye, player.lookDir, bow ? bow.range : HIT_REACH + 1) : null;
    aimedMobNow = aimedMob;
    interaction.suppressPrimary = aimedMob !== null || bow !== null; // 활을 들면 꾹 누르기는 당기기 (#119)
    interaction.suppressSecondary = aimedMob !== null;
    // 🛡️ 막기 (#118): 방패를 끼고 버튼(X)을 누르는 동안 — 한 번 톡 눌러도 GUARD_TAP_MS 는 막는다(아들 13차). 폰은 두 번 톡톡 = 계속. 서버엔 바뀔 때 + 5초마다
    if (inp.guard && !guardHeldPrev) guardTapUntil = now + GUARD_TAP_MS;
    guardHeldPrev = inp.guard;
    const wantGuard = (inp.guard || now < guardTapUntil) && myEquip.shield !== null && !myRiding && !anyPanelOpen();
    if (wantGuard !== guarding) {
      guarding = wantGuard;
      hud.setGuarding(guarding);
    }
    if (started && (guarding !== guardSent || (guarding && now - guardSentAt >= GUARD_RESEND_MS))) {
      guardSent = guarding;
      guardSentAt = now;
      net.sendGuard(guarding);
    }
    // 공격: 꾹 누르기(부수기와 같음) 또는 몹을 짧게 탭 (아빠 2026-09-28 — 폰에서 탭만으로). 동물은 탭이 먹이·길들이기라 꾹 눌러야 때린다
    // 검·도끼·곡괭이를 들고 탭 = 휘두르기 (아빠 2026-10-07, #141): 조준 안 해도 앞 범위 안의 몹을 때리고, 블록이면 한 번 캔다(톡톡 치면 깨진다), 아무것도 없으면 허공에
    const heldTool = toolOf(TOOLS, hud.selectedItem);
    let swingMob: number | null = null;
    if (inp.secondaryTap && heldTool !== null && !bow && !guarding && !anyPanelOpen()) {
      swingMob = aimedMob !== null && aimedMob < ANIMAL_ID_BASE ? aimedMob : aimedMob === null ? mobView.nearestInCone(player.eye, player.lookDir, HIT_REACH, SWING_CONE_COS, true) : null;
      if (swingMob === null && aimedMob === null) {
        const tdef = interaction.target ? registry.get(interaction.target.id) : null;
        if (tdef && !tdef.door && !tdef.chest) interaction.swingBurst(SWING_BURST_SEC);
        hand.swing();
      }
    }
    const tapAttack = inp.secondaryTap && ((aimedMob !== null && aimedMob < ANIMAL_ID_BASE) || swingMob !== null);
    if (bow && !guarding) {
      // 활·쇠뇌 (#119, 아빠): 누르고 있으면 시위를 당기고, 놓으면 쏜다. 짧게 탭하면 약한 화살
      if (inp.primary) {
        if (drawStart === null) drawStart = now;
      } else if (drawStart !== null) {
        const chargeMs = now - drawStart;
        drawStart = null;
        if (aimedMob !== null && hitCooldown <= 0) {
          hitCooldown = bow.cooldownMs / 1000;
          net.sendShoot(aimedMob, hud.selectedIndex, chargeMs);
          hand.swing();
        } else if (chargeMs > 300) hud.toast('몹을 노린 채 놓아야 화살이 나가요', 1200);
      }
      if (tapAttack && drawStart === null && hitCooldown <= 0) {
        hitCooldown = bow.cooldownMs / 1000;
        net.sendShoot(aimedMob!, hud.selectedIndex, 0);
        hand.swing();
      }
      drawProgress = drawStart === null ? 0 : Math.min(1, (now - drawStart) / bow.drawMs);
    } else {
      drawStart = null;
      drawProgress = 0;
      const meleeTarget = tapAttack ? (swingMob ?? aimedMob) : inp.primary ? aimedMob : null;
      if (meleeTarget !== null && hitCooldown <= 0 && !guarding) {
        hitCooldown = HIT_COOLDOWN_MS / 1000;
        net.sendHit(meleeTarget, hud.selectedIndex);
        hand.swing();
      }
    }
    hand.setDraw(drawProgress);
    // 동물에게 손에 든 것 쓰기 (M8-1): 먹이·뼈·빈손(앉기). 원정에 따라온 펫은 못 만진다
    if (aimedMob !== null && inp.secondaryTap && aimedMob >= ANIMAL_ID_BASE && ctx.kind === 'village') {
      net.sendUseMob(aimedMob, hud.selectedIndex);
      hand.swing();
    }
    // 조준한 동물이 바뀌면 안내 한 줄
    if (aimedMob !== aimHintFor) {
      aimHintFor = aimedMob;
      const f = aimedMob !== null ? mobView.figureOf(aimedMob) : undefined;
      if (f && aimedMob !== null && aimedMob >= ANIMAL_ID_BASE) {
        const def = MOBS.get(MOB_KIND_OF[f.kind] ?? 'cow');
        const baby = (f.state & ANIMAL_FLAG.baby) !== 0;
        const tamed = (f.state & ANIMAL_FLAG.tamed) !== 0;
        const foods = def.food.map((i) => nameOf(i)).join('·');
        const tip = tamed ? (pets.get(aimedMob)?.mine ? '빈손 탭 → 앉기/일어나기 · 카드에서 이름 짓기' : '남이 길들인 강아지예요') : def.tameWith.length ? `${def.tameWith.map((i) => nameOf(i)).join('·')}을(를) 들고 탭 → 길들이기` : `${foods}을(를) 들고 탭 → 먹이기`;
        const extra = def.id === 'sheep' ? ' · ✂️ 가위 들고 탭 → 양털' : def.id === 'chicken' ? ' · 빈손 탭 → 🥚 달걀' : def.id === 'cow' && !baby ? ' · 🪣 빈 양동이 들고 탭 → 우유' : '';
        hud.toast(`${def.name}${baby ? ' (아기)' : ''}${tamed ? ' 🐾' : ''} · ${tip}${extra}`, 3000);
      }
    }
    interaction.update(inp, dt);
    player.applyToCamera(camera, bobStrength);

    // 위치는 20Hz 로 서버에
    moveAcc += dt * 1000;
    if (started && moveAcc >= MOVE_SEND_MS) {
      moveAcc = 0;
      sendMove();
    }
    remote.update(dt, ctx.light, skyLevel); // 다른 사람도 주변 빛을 받는다 (#86)
    nestDragons.update(dt, Date.now() + serverClockOffset);
    mount.update(player, dt);
    beams.update();
    orbView.update(dt);
    mobView.update(dt);
    if (stamina) refreshStamina();

    // 이 프레임에 바뀐 블록들의 빛을 한 번에 다시 계산 → 빛이 바뀐 청크도 다시 메싱
    chunks.markDirtyAll(light.flush());

    if (interaction.target) {
      highlight.setTarget(interaction.target.x, interaction.target.y, interaction.target.z);
      highlight.setProgress(interaction.progress);
      // 캐는 중이면 보는 면에서 부스러기가 톡톡
      if (interaction.progress > 0 && (crumbAcc += dt) >= 0.11) {
        crumbAcc = 0;
        const t = interaction.target;
        particles.crumb(t.x, t.y, t.z, t.face, blockColor(t.id));
      }
    } else highlight.clearTarget();
    particles.update(dt);
    hud.setProgress(drawProgress > 0 ? drawProgress : interaction.progress); // 활 당김도 같은 고리로 (#119)
    {
      // 나침반 점: 마을에선 광장, 원정지에선 포탈 방향 (#103 — 마을이 넓어져 길을 잃지 않게). 보스가 살아 있으면 보스 (#127)
      const bossName = bossInfo ? `${BOSS_EMOJI[bossInfo.kind] ?? ''} ${MOBS.get(bossInfo.kind).name}` : '';
      const goal =
        ctx.kind === 'village'
          ? guideStep === 1
            ? { x: ctx.portalPos.x + 0.5, z: ctx.portalPos.z + 0.5, name: '포탈', near: 3 } // 첫 걸음: 포탈까지 안내
            : { x: 64.5, z: 64.5, name: '광장', near: 24 }
          : bossInfo
            ? { x: bossInfo.x, z: bossInfo.z, name: bossName, near: 5 }
            : { x: ctx.portalPos.x, z: ctx.portalPos.z + 0.5, name: '포탈', near: 12 };
      const gdx = goal.x - player.pos.x,
        gdz = goal.z - player.pos.z;
      const gd = Math.hypot(gdx, gdz);
      if (bossInfo && ctx.kind === 'expedition') {
        // 보스 바에 "북서 35칸" — 게이지만 보이고 어디 있는지 모르던 것 (아들 13차)
        const bearing = ((Math.atan2(bossInfo.x - player.pos.x, -(bossInfo.z - player.pos.z)) * 180) / Math.PI + 360) % 360;
        const bd = Math.hypot(bossInfo.x - player.pos.x, bossInfo.z - player.pos.z);
        hud.setBoss(bd > 5 ? `${bossName} · ${compassWord(bearing)} ${Math.round(bd)}칸` : `${bossName} · 바로 앞!`, bossInfo.hp, MOBS.get(bossInfo.kind).hp);
      }
      // 첫 걸음 진행 (M8-3): 포탈 가까이 → ②, 원정지에 들어가면 → ③
      if (guideStep === 1 && ctx.kind === 'village' && gd <= 7) setGuideStep(2);
      else if (guideStep === 2 && ctx.kind === 'expedition') setGuideStep(3);
      if (gd > goal.near) hud.setCompassTarget(((Math.atan2(gdx, -gdz) * 180) / Math.PI + 360) % 360, `${goal.name} ${Math.round(gd)}칸`);
      else hud.setCompassTarget(null, null);
    }
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
    {
      const b = heldBlock();
      if (guarding) hand.setItem('shield', iconOf('shield', 16)); // 막는 동안은 방패를 든다 (#118)
      else if (b > 0) hand.setBlock(b);
      else hand.setItem(hud.selectedItem, hud.selectedItem ? iconOf(hud.selectedItem, 16) : null); // 도구·안장 같은 아이템도 손에 보인다 (#96) — 16픽셀을 세운 입체
    }
    if (started && hud.selectedItem !== sentHeld) {
      sentHeld = hud.selectedItem;
      net.sendHeld(sentHeld); // 손에 든 것이 바뀌면 다른 사람에게 (#96)
    }
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
      mobView,
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
      // 아빠 선물 (#79): 가방엔 이미 들어와 있고, 시작 뒤에 알려 준다 (시작 화면 뒤에서 혼자 떴다 사라지지 않게)
      welcome.gifts.forEach((g, i) => setTimeout(() => hud.toast(`🎁 ${g.message}`, 8000), 2500 + i * 1500));
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

/** 탭 휘두르기 (#141): 시선에서 이 각도(cos) 안의 몹은 조준 안 해도 맞는다 (약 43°), 블록은 이만큼 캔 것으로 */
const SWING_CONE_COS = Math.cos(0.75);
const SWING_BURST_SEC = 0.4;

/** 방위각(북 0, 시계 방향 도) → 여덟 방향 한국어 */
function compassWord(bearing: number): string {
  const words = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
  return words[Math.round((((bearing % 360) + 360) % 360) / 45) % 8]!;
}
