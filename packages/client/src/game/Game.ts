import {
  AIR_ID,
  type BlockChangedMsg,
  CHUNK_SIZE,
  FLAG_GROUND,
  FLAG_SNEAK,
  FLAG_SPRINT,
  FLAG_WATER,
  LightEngine,
  REJECT_KO,
  decodeChunk,
  generateVillage,
} from '@dragon-village/shared';
import { BLOCKS } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { GamepadInput } from '../input/gamepad';
import { InputManager } from '../input/InputManager';
import { KeyboardMouse } from '../input/keyboard';
import { TouchControls } from '../input/touch';
import { buildMeshBlockInfo } from '../mesh/blockInfo';
import type { NetClient, Welcome } from '../net/NetClient';
import { RemotePlayers } from '../net/RemotePlayers';
import { Player } from '../player/Player';
import { SKY_COLOR, createChunkMaterials } from '../render/ChunkMaterial';
import { ChunkRenderer } from '../render/ChunkRenderer';
import { HandView } from '../render/Hand';
import { BlockHighlight } from '../render/Highlight';
import { Sky } from '../render/Sky';
import { loadTextureAtlas } from '../render/textures';
import { Hud, type HotbarSlot } from '../ui/hud';
import { renderBlockIcon } from '../ui/icons';
import { MesherPool } from '../workers/MesherPool';
import { AutoQuality } from './AutoQuality';
import { Interaction } from './Interaction';

/** 핫바(10칸, 키 1~9·0) — 아들이 blocks.json 에 있는 id 로 바꿔도 된다. 8번 발광석은 조명 확인용 */
const HOTBAR_IDS = ['grass', 'dirt', 'stone', 'planks', 'log', 'leaves', 'glass', 'glowstone', 'water', 'lava'];
/** 위치 전송 간격 (20Hz) */
const MOVE_SEND_MS = 50;

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

export async function createGame(root: HTMLElement, opts: GameOptions): Promise<GameHandle> {
  const { isTouch, net, welcome } = opts;
  const registry = BLOCKS;
  const atlas = await loadTextureAtlas();
  const blockInfo = buildMeshBlockInfo(registry, atlas.index);

  // ---- 세계: 서버가 준 시드로 똑같이 만들고, 서버가 보낸 바뀐 청크를 덮어쓴다 (서버가 진실, 규칙 1) ----
  const village = generateVillage(registry, welcome.village.seed);
  const { world } = village;
  const applyChunk = (cx: number, cy: number, cz: number, bytes: Uint8Array): void => {
    if (!world.chunkInBounds(cx, cy, cz)) return;
    decodeChunk(bytes, registry, world.getOrCreateChunk(cx, cy, cz));
  };
  for (const c of welcome.chunks) applyChunk(c.cx, c.cy, c.cz, c.bytes);
  const spawn = { x: welcome.spawn.x, y: welcome.spawn.y, z: welcome.spawn.z, yaw: welcome.spawn.yaw };
  const myIdx = welcome.playerIdx;

  // ---- 조명: 블록이 모두 자리 잡은 뒤 한 번 전체 계산. 이후는 바뀐 칸만 ----
  const light = new LightEngine(world, registry);
  light.computeAll();

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
  const chunks = new ChunkRenderer(world, light, materials, pool, scene);
  chunks.renderDistance = isTouch ? 5 : 8;
  const applyFog = () => {
    const d = chunks.renderDistance * CHUNK_SIZE;
    materials.setFog(d * 0.55, d * 0.98);
    camera.far = d * 1.3 + 50;
    camera.updateProjectionMatrix();
  };
  applyFog();
  chunks.markAll();

  const sky = new Sky(scene);
  const highlight = new BlockHighlight(scene);
  const hand = new HandView(materials, blockInfo);
  const remote = new RemotePlayers(scene);
  for (const p of welcome.players) remote.upsert(p);

  // ---- HUD ----
  const hud = new Hud(root, isTouch);
  const slots: HotbarSlot[] = HOTBAR_IDS.map((id) => {
    const def = registry.find(id);
    if (!def || !def.textures) return { blockNum: 0, name: id, icon: null };
    const missing = atlas.images.get('missing')!;
    const top = atlas.images.get(def.textures[0]) ?? missing;
    const side = atlas.images.get(def.textures[1]) ?? missing;
    return { blockNum: def.num, name: def.name, icon: renderBlockIcon(top, side, 40) };
  });
  hud.setSlots(slots);
  const updateVillageInfo = () =>
    hud.setVillageInfo(`마을 "${welcome.village.name}" · 코드 ${welcome.village.code} · 지금 ${remote.count + 1}명 (친구에게 코드를 알려 주면 같은 마을에 들어와요)`);
  updateVillageInfo();

  // ---- 입력 ----
  const input = new InputManager();
  const kbm = new KeyboardMouse(renderer.domElement);
  input.add(kbm);
  const touch = new TouchControls(hud.touchUI);
  input.add(touch);
  input.add(new GamepadInput());
  input.paused = true;

  // ---- 플레이어 ----
  const player = new Player(world, registry, spawn, spawn.yaw);
  player.pitch = welcome.spawn.pitch;

  // ---- 블록 변경: 먼저 화면에 그리고(낙관) 서버가 거절하면 되돌린다 ----
  const pending = new Map<number, { x: number; y: number; z: number; prev: number }>();
  let seq = 0;
  const sendBlock = (x: number, y: number, z: number, newNum: number, prev: number) => {
    seq = (seq + 1) & 0xffff;
    pending.set(seq, { x, y, z, prev });
    net.sendBlockChange({ seq, x, y, z, id: registry.get(newNum).id });
    if (pending.size > 200) pending.delete(pending.keys().next().value!); // 응답이 영영 안 오면 오래된 것부터 잊는다
  };
  const forgetPendingAt = (x: number, y: number, z: number) => {
    for (const [k, v] of pending) if (v.x === x && v.y === y && v.z === z) pending.delete(k);
  };
  /** 서버가 확정한 블록을 세계에 넣는다 */
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

  // ---- 서버에서 오는 것 ----
  let disconnected = false;
  net.attach({
    onChunk: (m) => {
      applyChunk(m.cx, m.cy, m.cz, m.bytes);
      chunks.markDirty(m.cx, m.cy, m.cz);
      // 청크 통째로 바뀌었으니 그 안의 빛은 전부 다시
      for (let y = 0; y < CHUNK_SIZE; y++) for (let z = 0; z < CHUNK_SIZE; z++) for (let x = 0; x < CHUNK_SIZE; x++) light.markChanged(m.cx * 16 + x, m.cy * 16 + y, m.cz * 16 + z);
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
        const res = world.setBlock(p.x, p.y, p.z, p.prev);
        if (res.changed) {
          chunks.markDirtyAll(res.dirty);
          light.markChanged(p.x, p.y, p.z);
        }
      }
      hud.toast(REJECT_KO[m.reason] ?? '서버가 거절했어요', 2500);
    },
    onPlayers: (list) => remote.setState(list, myIdx),
    onPlayerJoined: (p) => {
      remote.upsert(p);
      hud.toast(`${p.nick} 님이 들어왔어요`, 3000);
      updateVillageInfo();
    },
    onPlayerLeft: (idx) => {
      const nick = remote.nickOf(idx);
      remote.remove(idx);
      if (nick) hud.toast(`${nick} 님이 나갔어요`, 3000);
      updateVillageInfo();
    },
    onError: (_code, message) => hud.toast(message, 4000),
    onClose: (reason) => {
      disconnected = true;
      input.paused = true;
      kbm.enabled = false;
      hud.showOverlay('서버와 연결이 끊어졐어요', reason + '\n다시 들어가려면 아래를 눌러요.', '다시 연결');
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
    } else if (started && !hud.overlayVisible) {
      resume();
    }
  };
  document.addEventListener('pointerlockchange', () => {
    if (isTouch || !started || kbm.lockFailed || disconnected) return;
    if (!kbm.locked && !hud.overlayVisible && !hud.helpVisible) pause();
  });
  // HUD 가 캔버스를 덮고 있으므로 root 에서 듣는다 (오버레이 없이 잠금이 풀린 경우 대비)
  root.addEventListener('click', () => {
    if (started && !isTouch && !kbm.locked && !hud.overlayVisible) resume();
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

  const sendMove = () => {
    if (!net.connected) return;
    const flags = (player.sneaking ? FLAG_SNEAK : 0) | (player.sprinting ? FLAG_SPRINT : 0) | (player.onGround ? FLAG_GROUND : 0) | (player.inWater ? FLAG_WATER : 0);
    net.sendMove({ x: player.pos.x, y: player.pos.y, z: player.pos.z, yaw: player.yaw, pitch: player.pitch, flags });
  };

  const debugText = (): string => {
    const p = player.pos;
    const yawDeg = ((player.yaw * 180) / Math.PI + 360) % 360;
    const facing = FACING[Math.round(yawDeg / 45) % 8];
    const t = interaction.target;
    const tgt = t ? `${registry.get(t.id).name} (${t.x}, ${t.y}, ${t.z}) 면 ${['+X', '-X', '+Y', '-Y', '+Z', '-Z'][t.face]}` : '없음';
    return [
      `FPS ${fps}  프레임 ${quality.ema.toFixed(1)}ms  해상도 ×${quality.pixelRatio.toFixed(2)}  렌더거리 ${chunks.renderDistance}  화면 ${sizeW}×${sizeH} 버퍼 ${renderer.domElement.width}×${renderer.domElement.height} 비율 ${camera.aspect.toFixed(2)}`,
      `드로우 ${drawCalls}  삼각형 ${(triangles / 1000).toFixed(1)}k`,
      `청크 보임 ${chunks.stats.visibleChunks}  큐 ${chunks.queued}  진행 ${chunks.inflight}  워커 ${pool.size}`,
      `메싱 최근 ${chunks.stats.lastMs.toFixed(1)}ms  평균 ${chunks.stats.avgMs.toFixed(1)}ms  최대 ${chunks.stats.maxMs.toFixed(1)}ms  총 ${chunks.stats.meshed}`,
      `위치 ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)}  yaw ${yawDeg.toFixed(0)}°  pitch ${((player.pitch * 180) / Math.PI).toFixed(0)}°  ${facing}`,
      `조준 ${tgt}`,
      `바닥 ${player.onGround ? 'O' : 'X'}  물 ${player.inWater ? 'O' : 'X'}  웅크림 ${player.sneaking ? 'O' : 'X'}  달리기 ${player.sprinting ? 'O' : 'X'}`,
      `빛 여기 하늘 ${light.skyAt(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))} 블록 ${light.blockAt(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))}  조명 처음 ${light.stats.initialMs.toFixed(0)}ms  최근 ${light.stats.lastFlushMs.toFixed(1)}ms/${light.stats.lastFlushCells}칸  지형 생성 ${village.ms.toFixed(0)}ms  청크 ${world.chunkCount}`,
      `${isTouch ? '터치' : 'PC'}  ${navigator.hardwareConcurrency ?? '?'}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio || 1).toFixed(1)}`,
      `서버 ${net.connected ? `연결됨 왕복 ${net.rtt}ms` : '끊김'}  나 #${myIdx}  같이 ${remote.count}명  블록 대기 ${pending.size}  마을 ${welcome.village.code} 시드 ${welcome.village.seed}  받은 청크 ${welcome.chunks.length}`,
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

    // 안전망: 15프레임마다 크기 재확인 (이벤트를 놓쳐도 0.25초 안에 복구)
    if ((sizeCheck = (sizeCheck + 1) % 15) === 0) applySize();

    const inp = input.frame(dt);
    if (inp.toggleDebug) debugVisible = !debugVisible;
    if (inp.slotDelta !== 0) hud.selectDelta(inp.slotDelta);
    if (inp.slotSelect >= 0) hud.select(inp.slotSelect);
    interaction.selectedBlock = hud.selectedBlock;

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

    chunks.update(player.pos.x, player.pos.y, player.pos.z);
    materials.setTime(now / 1000);
    sky.update(camera.position);
    hand.setBlock(hud.selectedBlock);
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
    // 개발 콘솔에서 들여다보기: __dv.player.pos 등
    (window as unknown as { __dv: unknown }).__dv = {
      world,
      registry,
      chunks,
      player,
      interaction,
      camera,
      scene,
      renderer,
      pool,
      hud,
      quality,
      hand,
      highlight,
      light,
      net,
      remote,
      pending,
      welcome,
      input,
      kbm,
      /** rAF 없이 프레임을 돌린다 (숨겨진 탭에서의 자동 테스트용) */
      tick: (dtSec: number, render = false) => tick(last + dtSec * 1000, render),
    };
  }

  hud.showOverlay(
    `${welcome.village.name}`,
    (isTouch ? '왼쐽 아래 스틱: 움직이기  ·  드래그: 둘러보기\n짧게 탭: 놓기  ·  꾹: 부수기' : 'WASD 이동  ·  마우스 둘러보기\n좌클릭 꾹: 부수기  ·  우클릭: 놓기') +
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
      chunks.dispose();
      pool.dispose();
      sky.dispose();
      highlight.dispose();
      hand.dispose();
      remote.dispose();
      materials.dispose();
      atlas.texture.dispose();
      renderer.dispose();
      window.removeEventListener('resize', resize);
      sizeObserver?.disconnect();
      root.innerHTML = '';
    },
  };
}
