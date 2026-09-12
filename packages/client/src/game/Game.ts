import { CHUNK_SIZE } from '@dragon-village/shared';
import { BLOCKS } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { GamepadInput } from '../input/gamepad';
import { InputManager } from '../input/InputManager';
import { KeyboardMouse } from '../input/keyboard';
import { TouchControls } from '../input/touch';
import { buildMeshBlockInfo } from '../mesh/blockInfo';
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
import { buildTestWorld } from '../world/testWorld';
import { AutoQuality } from './AutoQuality';
import { Interaction } from './Interaction';

/** M0 핫바 — 아들이 blocks.json 에 있는 id 로 바꿔도 된다 */
const HOTBAR_IDS = ['grass', 'dirt', 'stone', 'cobblestone', 'planks', 'log', 'leaves', 'glass', 'sand'];

export interface GameOptions {
  isTouch: boolean;
}

export interface GameHandle {
  /** 오버레이를 닫고 조작을 시작한다 (사용자 제스처 안에서 호출) */
  start(): void;
  dispose(): void;
}

const FACING = ['남', '남서', '서', '북서', '북', '북동', '동', '남동'];

export async function createGame(root: HTMLElement, opts: GameOptions): Promise<GameHandle> {
  const { isTouch } = opts;
  const registry = BLOCKS;
  const atlas = await loadTextureAtlas();
  const blockInfo = buildMeshBlockInfo(registry, atlas.index);
  const { world, spawn } = buildTestWorld(registry);

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
  const chunks = new ChunkRenderer(world, materials, pool, scene);
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
  const interaction = new Interaction(world, registry, player, {
    onBlocksChanged: (dirty) => chunks.markDirtyAll(dirty),
    onSwing: () => hand.swing(),
  });

  const quality = new AutoQuality(renderer, isTouch);
  const resize = () => {
    const w = root.clientWidth || window.innerWidth;
    const h = root.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 200));

  // ---- 전체화면 / 디버그 버튼 ----
  let debugVisible = false;
  hud.debugBtn.addEventListener('click', () => (debugVisible = !debugVisible));
  hud.fullscreenBtn.addEventListener('click', () => void enterFullscreen());
  async function enterFullscreen(): Promise<void> {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      const o = screen.orientation as ScreenOrientation & { lock?: (t: string) => Promise<void> };
      if (o.lock) await o.lock('landscape').catch(() => undefined);
    } catch {
      /* iOS Safari 등 미지원 */
    }
  }

  // ---- 시작 / 일시정지 ----
  let started = false;
  let lockWarned = false;
  const pause = () => {
    input.paused = true;
    kbm.enabled = false;
    hud.showOverlay('잠깐 멈춤', 'ESC 로 나왔어요. 다시 들어가려면 아래를 눌러요.', '계속하기');
  };
  const resume = () => {
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
    if (isTouch || !started || kbm.lockFailed) return;
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
    triangles = 0;
  const bobStrength = isTouch ? 0.6 : 1;

  const debugText = (): string => {
    const p = player.pos;
    const yawDeg = ((player.yaw * 180) / Math.PI + 360) % 360;
    const facing = FACING[Math.round(yawDeg / 45) % 8];
    const t = interaction.target;
    const tgt = t ? `${registry.get(t.id).name} (${t.x}, ${t.y}, ${t.z}) 면 ${['+X', '-X', '+Y', '-Y', '+Z', '-Z'][t.face]}` : '없음';
    return [
      `FPS ${fps}  프레임 ${quality.ema.toFixed(1)}ms  해상도 ×${quality.pixelRatio.toFixed(2)}  렌더거리 ${chunks.renderDistance}`,
      `드로우 ${drawCalls}  삼각형 ${(triangles / 1000).toFixed(1)}k`,
      `청크 보임 ${chunks.stats.visibleChunks}  큐 ${chunks.queued}  진행 ${chunks.inflight}  워커 ${pool.size}`,
      `메싱 최근 ${chunks.stats.lastMs.toFixed(1)}ms  평균 ${chunks.stats.avgMs.toFixed(1)}ms  최대 ${chunks.stats.maxMs.toFixed(1)}ms  총 ${chunks.stats.meshed}`,
      `위치 ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)}  yaw ${yawDeg.toFixed(0)}°  pitch ${((player.pitch * 180) / Math.PI).toFixed(0)}°  ${facing}`,
      `조준 ${tgt}`,
      `바닥 ${player.onGround ? 'O' : 'X'}  물 ${player.inWater ? 'O' : 'X'}  웅크림 ${player.sneaking ? 'O' : 'X'}  달리기 ${player.sprinting ? 'O' : 'X'}`,
      `${isTouch ? '터치' : 'PC'}  ${navigator.hardwareConcurrency ?? '?'}코어  ${window.innerWidth}×${window.innerHeight}@${(window.devicePixelRatio || 1).toFixed(1)}`,
    ].join('\n');
  };

  const frame = (now: number) => {
    if (!running) return;
    requestAnimationFrame(frame);
    tick(now, true);
  };

  /** 한 프레임. render=false 면 화면은 안 그린다 (테스트·숨김 탭용) */
  const tick = (now: number, render: boolean) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    const inp = input.frame(dt);
    if (inp.toggleDebug) debugVisible = !debugVisible;
    if (inp.slotDelta !== 0) hud.selectDelta(inp.slotDelta);
    if (inp.slotSelect >= 0) hud.select(inp.slotSelect);
    interaction.selectedBlock = hud.selectedBlock;

    player.update(inp, dt);
    interaction.update(inp, dt);
    player.applyToCamera(camera, bobStrength);

    if (interaction.target) {
      highlight.setTarget(interaction.target.x, interaction.target.y, interaction.target.z);
      highlight.setProgress(interaction.progress);
    } else highlight.clearTarget();
    hud.setProgress(interaction.progress);

    chunks.update(player.pos.x, player.pos.z);
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
      /** rAF 없이 프레임을 돌린다 (숨겨진 탭에서의 자동 테스트용) */
      tick: (dtSec: number, render = false) => tick(last + dtSec * 1000, render),
    };
  }

  hud.showOverlay(
    '드래곤 마을 (가칭)',
    isTouch ? '왼쪽 반: 움직이기  ·  오른쪽: 둘러보기\n짧게 탭: 놓기  ·  꾹: 부수기' : 'WASD 이동  ·  마우스 둘러보기\n좌클릭 꾹: 부수기  ·  우클릭: 놓기',
    isTouch ? '탭해서 시작' : '클릭해서 시작',
  );

  return {
    start() {
      if (started) return;
      started = true;
      if (isTouch) {
        void enterFullscreen();
        if (window.innerHeight > window.innerWidth) hud.toast('폰을 가로로 돌리면 더 편해요', 3500);
      }
      resume();
    },
    dispose() {
      running = false;
      input.dispose();
      chunks.dispose();
      pool.dispose();
      sky.dispose();
      highlight.dispose();
      hand.dispose();
      materials.dispose();
      atlas.texture.dispose();
      renderer.dispose();
      window.removeEventListener('resize', resize);
      root.innerHTML = '';
    },
  };
}
