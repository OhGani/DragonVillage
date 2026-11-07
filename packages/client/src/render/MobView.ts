/**
 * 원정 몹 그리기 (M7-2·M7-3): 서버 MobsState(20Hz)를 부드럽게 따라가는 좀비·크리퍼·거미 복셀 인형.
 * 좀비는 플레이어 인형 생성기에 초록 피부·낡은 옷 팔레트, 팔은 앞으로. 크리퍼는 머리 8 + 몸 4×12 + 다리 넷.
 * 거미(M7-3)는 머리(붉은 눈 여덟)·가슴·큰 배 + 다리 여덟(따로 메시, 걷는 대로 흔든다). 넓고 낮다(mobSize).
 * 맞으면 붉게 깜빡, 크리퍼가 부풀 때 하얘지며 커진다, 죽거나 터지면 조각이 흩어진다.
 * 머리 위 체력 바(빨강, 숫자)와 맞을 때 떠오르는 피해 숫자 — 맞았다는 게 한눈에 보이게 (#94).
 * 거미 왕(M7-4)은 같은 거미 복셀을 2.2배로, 자줏빛 몸에 금 왕관. 잠들었을 땐 낮게 웅크리고, 소환할 땐 몸을 든다.
 * 동물(M8-1)은 `animalModel.ts` — 마인크래프트 비율·색 변종, 머리·다리·꼬리·날개를 따로 움직인다(걷기·풀 뜯기·꼬리·날개). 아기는 머리가 크다.
 */
import { ANIMAL_FLAG, MOB_KIND_OF, MOB_STATE, type MobEntry, mobSize, ANIMAL_ID_BASE, type SepBody } from '@dragon-village/shared';
import { MOBS } from '@dragon-village/shared/data';
import * as THREE from 'three';
import { PLAYER_SHADES, type SkinPalette, VOXEL, playerVoxels } from './playerModel';
import { type Part, FISH_MODEL_KINDS, WILD_MODEL_KINDS, animalParts, animalVariant, collarVoxels, gorillaParts, pufferPuffedVoxels, ravagerParts, tigerGlowEyes, wardenParts, wildParts } from './animalModel';
import { type Voxel, buildVoxelGeometry } from './voxelGeometry';
import { ENDERMAN_SPOTS, SKELETON_KIND_OF, endermanVoxels, skeletonVoxels } from './skeletonModel';
import { endermiteVoxels, witchVoxels, zombieKindOf, zombieVoxels } from './zombieModel';
import { nameSprite } from '../net/RemotePlayers';
import { dragonMesh } from './DragonMesh';

const ZOMBIE: SkinPalette = { shirt: 0x2f6a7a, skin: 0x5d8b4a, hair: 0x2c3e2b, pants: 0x3a3560, shoes: 0x25211f };
/** 우민 (M7-5): 잿빛 피부. 변명자는 짙은 남색 옷, 약탈자는 갈색 가죽, 소환사는 검은 로브 */
const HUMANOID: Partial<Record<string, SkinPalette>> = {
  zombie: ZOMBIE,
  vindicator: { shirt: 0x2f3f52, skin: 0x9aa3a9, hair: 0x2a2a2a, pants: 0x1e2a36, shoes: 0x1a1a1a },
  pillager: { shirt: 0x5a4632, skin: 0x9aa3a9, hair: 0x2a2a2a, pants: 0x3a2f24, shoes: 0x1a1a1a },
  evoker: { shirt: 0x1c1c22, skin: 0x9aa3a9, hair: 0x111111, pants: 0x1c1c22, shoes: 0x111111 },
  skeleton: { shirt: 0xdcdcdc, skin: 0xd8d8d8, hair: 0xbdbdbd, pants: 0xcfcfcf, shoes: 0x9e9e9e },
  // 사막 (v1.1-1): 허스크는 모래색 좀비, 엔더맨은 새까맣고 보랏빛 눈 — 몸을 1.5배 키운다
  husk: { shirt: 0x7a6b45, skin: 0xa89a62, hair: 0x5e5233, pants: 0x6a5c3c, shoes: 0x3f3624 },
  enderman: { shirt: 0x141414, skin: 0x161616, hair: 0x101010, pants: 0x141414, shoes: 0x0e0e0e, eyes: 0xd36cff },
  // 설원 (v1.1-2): 스트레이는 푸르스름한 스켈레톤에 눈 덮인 머리
  stray: { shirt: 0xb9c6cf, skin: 0xc8d3da, hair: 0xeef4f8, pants: 0xaab8c2, shoes: 0x8a98a2 },
  // 네더 (v1.1-3): 좀비 피글린은 분홍 살에 썩은 초록, 위더 스켈레톤은 새까맣고 키가 크다(1.3배)
  zombified_piglin: { shirt: 0x6b8a4a, skin: 0xf0a8a0, hair: 0xd98080, pants: 0x4a3b7a, shoes: 0x3a2a2a },
  wither_skeleton: { shirt: 0x262626, skin: 0x2b2b2b, hair: 0x1c1c1c, pants: 0x222222, shoes: 0x171717, eyes: 0x8a8a8a },
  // 주민 (#168): 갈색 로브, 큰 코는 아직 — 아들 그림 기다림
  villager: { shirt: 0x6b4f2a, skin: 0xc9a27c, hair: 0x4a3320, pants: 0x5a4224, shoes: 0x3a2a1a, eyes: 0x3d7a4a },
  // 좀비 주민 (#244): 좀비 피부에 주민의 갈색 로브, 팔은 앞으로. 황금 사과를 먹으면 떨면서 ✨
  zombie_villager: { shirt: 0x6b4f2a, skin: 0x5d8b4a, hair: 0x2c3e2b, pants: 0x5a4224, shoes: 0x3a2a1a, eyes: 0xc0392b },
  // 철 골렘 (#169): 잿빛 쇠, 덩굴 자국. 몸을 1.4배로
  iron_golem: { shirt: 0xc9cfcf, skin: 0xd6dcdc, hair: 0xb8c4b8, pants: 0xc9cfcf, shoes: 0x9aa39a, eyes: 0xb03030 },
  // 늪 마녀 (2026-11-06): 보랏빛 로브, 푸르스름한 살, 초록 눈 — 뾰족 모자는 따로
  // 난폭한 피글린 (2026-11-07): 분홍 살에 검은 옷·금빛 허리띠
  piglin_brute: { shirt: 0x2a2624, skin: 0xe9a196, hair: 0x5a3a2a, pants: 0x3b2f2a, shoes: 0x1e1a18, eyes: 0x2a1a10 },
  witch: { shirt: 0x4a2a5e, skin: 0xb5b08e, hair: 0x2a1d24, pants: 0x3a2048, shoes: 0x241a20, eyes: 0x3fae4a },
  // 네 왕 (아들 보스 설계, 2026-11-06): 자기 종족과 같은 몸을 크게 + 금 왕관
  skeleton_king: { shirt: 0xdcdcdc, skin: 0xd8d8d8, hair: 0xbdbdbd, pants: 0xcfcfcf, shoes: 0x9e9e9e, eyes: 0xff4040 },
  zombie_king: { ...ZOMBIE, eyes: 0xff4040 },
  enderman_king: { shirt: 0x141414, skin: 0x161616, hair: 0x101010, pants: 0x141414, shoes: 0x0e0e0e, eyes: 0xff4dff },
};
const GOLD_CROWN = 0xf5c518;
/** 금 왕관 (네 왕): 머리 윗면(top y)에 8×8 테 + 모서리·가운데 뿔, 앞에 빨간 보석. 사람 머리는 x −4..3, z −4..3 */
function crownVoxels(top: number): Voxel[] {
  const out: Voxel[] = [];
  for (let x = -4; x <= 3; x++)
    for (let z = -4; z <= 3; z++) {
      if (x !== -4 && x !== 3 && z !== -4 && z !== 3) continue;
      out.push({ x, y: top, z, c: css(z === -4 && (x === -1 || x === 0) ? 0xd32f2f : GOLD_CROWN) });
      const spike = (x === -4 || x === 3 || x === -1 || x === 0) && (z === -4 || z === 3 || z === -1 || z === 0);
      if (spike) out.push({ x, y: top + 1, z, c: css(GOLD_CROWN) });
      if ((x === -4 || x === 3) && (z === -4 || z === 3)) out.push({ x, y: top + 2, z, c: css(0xffe27a) });
    }
  return out;
}
/** 마녀 모자: 머리 위(top y) 넓은 챙 10×10, 위로 좁아지는 뾰족 원뿔, 초록 띠 */
function witchHatVoxels(top: number): Voxel[] {
  const out: Voxel[] = [];
  const HAT = 0x1c1a1e,
    BAND = 0x2a272c;
  for (let x = -5; x <= 4; x++) for (let z = -5; z <= 4; z++) out.push({ x, y: top, z, c: css(HAT) });
  const layers: [number, number, number][] = [
    [-4, 3, 2],
    [-3, 2, 2],
    [-2, 1, 2],
    [-1, 0, 2],
  ];
  let y = top + 1;
  layers.forEach(([a, b, hgt], i) => {
    for (let k = 0; k < hgt; k++, y++) for (let x = a; x <= b; x++) for (let z = a; z <= b; z++) out.push({ x, y, z, c: css(i === 0 && k === 0 ? BAND : HAT) });
  });
  out.push({ x: 0, y, z: 1, c: css(HAT) }, { x: 0, y: y + 1, z: 2, c: css(HAT) }); // 꼭지는 뒤로 꺾인다
  // 앞 띠의 초록 보석 (아빠 그림)
  out.push({ x: -1, y: top + 1, z: -5, c: css(0x2fae3a) }, { x: 0, y: top + 1, z: -5, c: css(0x1f8a2a) }, { x: -1, y: top + 2, z: -5, c: css(0x1f8a2a) }, { x: 0, y: top + 2, z: -5, c: css(0x5fd86a) });
  return out;
}
/**
 * 가디언·엘더 가디언 (아빠가 보낸 그림 2026-11-06): 바닥 위 3칸에 뜬 12×12×12 상자, 앞면 가운데 흰 눈에 붉은 눈동자,
 * 열두 모서리 가운데에서 비스듬히 뻗은 가시(공격할 땐 짧게 움츠린다 — spikes 'short'), 뒤로 길게 휘어 오르는 꼬리 끝에 줄무늬 지느러미.
 * 가디언은 청록 몸·주황 가시, 엘더는 잿빛 흰 몸·남보라 가시
 */
function guardianVoxels(elder: boolean, spikes: 'body' | 'long' | 'short'): Voxel[] {
  const out: Voxel[] = [];
  const BODY = elder ? [0xcfc9b2, 0xbdb59c, 0xd9d3be, 0xa9a28c] : [0x5a9a8a, 0x4f8a7c, 0x6aa898, 0x447a6e];
  const SPIKE = elder ? [0x3c3f6e, 0x2a2c52] : [0xe07a2a, 0xb85a1a];
  const FIN = elder ? [0x8a8478, 0x6a655c] : [0xc08040, 0x6a4a2a];
  const Y0 = 3;
  const h = (x: number, y: number, z: number) => ((((x + 9) * 73856093) ^ ((y + 3) * 19349663) ^ ((z + 7) * 83492791)) >>> 0) % 100;
  if (spikes === 'body') {
    for (let y = Y0; y < Y0 + 12; y++)
      for (let z = -6; z <= 5; z++)
        for (let x = -6; x <= 5; x++) {
          const shell = x === -6 || x === 5 || y === Y0 || y === Y0 + 11 || z === -6 || z === 5;
          if (!shell) continue;
          out.push({ x, y, z, c: css(BODY[h(x, y, z) % BODY.length]!) });
        }
    // 눈: 앞면(z −7) 가운데 흰자 4×4, 붉은 눈동자 2×2
    for (let y = Y0 + 4; y < Y0 + 8; y++) for (let x = -2; x <= 1; x++) out.push({ x, y, z: -7, c: css(x >= -1 && x <= 0 && y >= Y0 + 5 && y <= Y0 + 6 ? (elder ? 0x8a3a4a : 0x9a1a1a) : 0xe8e0d8) });
    // 꼬리: 등 위쪽 뒤에서 뒤로 뻗으며 조금씩 올라간다 (4 → 3 → 2 → 2 칸 굵기), 끝에 세로 지느러미
    const segs: [number, number, number][] = [
      [4, 6, Y0 + 7],
      [3, 10, Y0 + 8],
      [2, 14, Y0 + 9],
      [2, 18, Y0 + 10],
    ];
    for (const [w, z0, yc] of segs)
      for (let z = z0; z < z0 + 4; z++) for (let x = -Math.ceil(w / 2); x < Math.floor(w / 2); x++) for (let y = yc - Math.floor(w / 2); y < yc + Math.ceil(w / 2); y++) out.push({ x, y, z, c: css(BODY[h(x, y, z) % BODY.length]!) });
    for (let y = Y0 + 7; y <= Y0 + 13; y++) for (let z = 22; z <= 24; z++) out.push({ x: -1, y, z, c: css(FIN[(y + z) % 2]!) });
    return out;
  }
  // 가시: 열두 모서리 가운데에서 바깥쪽 대각선으로 (길면 6칸, 움츠리면 1칸)
  const cx = -0.5,
    cy = Y0 + 5.5,
    cz = -0.5;
  const len = spikes === 'long' ? 6 : 1;
  const edges: [number, number, number][] = [];
  for (const a of [-1, 1])
    for (const b of [-1, 1]) {
      edges.push([a, b, 0], [a, 0, b], [0, a, b]);
    }
  for (const [sx, sy, sz] of edges)
    for (let k = 0; k < len; k++) {
      const x = Math.round(cx + sx * (6 + k * 0.85)),
        y = Math.round(cy + sy * (6 + k * 0.85)),
        z = Math.round(cz + sz * (6 + k * 0.85));
      out.push({ x, y, z, c: css(SPIKE[k % 2]!) });
    }
  return out;
}
/**
 * 슬라임 (늪, 2026-11-06 — 아빠가 보낸 "큰 슬라임" 그림): 8×8×8 상자. 겉은 밝고 투명한 젤리라 면마다 테두리 한 칸이 밝고,
 * 안쪽 6×6 은 속 상자가 비쳐 조금 짙다. 앞면에 짙은 초록 눈 둘(2×2)과 작은 입. 칸마다 얼룩을 살짝
 */
function slimeVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const RIM = 0x8fd27c,
    INNER = 0x6dbb5a,
    EYE = 0x2f6a2c,
    MOUTH = 0x3d7a36;
  const mottle = (c: number, x: number, y: number, z: number) => {
    const h = ((x + 11) * 73856093) ^ ((y + 5) * 19349663) ^ ((z + 13) * 83492791);
    const k = 0.94 + (((h >>> 0) % 100) / 100) * 0.12;
    const ch = (v: number) => Math.min(255, Math.round(v * k));
    return (ch(c >> 16) << 16) | (ch((c >> 8) & 255) << 8) | ch(c & 255);
  };
  for (let y = 0; y < 8; y++)
    for (let z = -4; z <= 3; z++)
      for (let x = -4; x <= 3; x++) {
        const bx = x === -4 || x === 3,
          by = y === 0 || y === 7,
          bz = z === -4 || z === 3;
        if (!bx && !by && !bz) continue;
        const rim = (bx ? 1 : 0) + (by ? 1 : 0) + (bz ? 1 : 0) >= 2; // 면의 테두리 = 모서리
        let c = rim ? RIM : INNER;
        if (z === -4) {
          // 앞 얼굴 (그림처럼): 눈은 가운데보다 조금 위 양옆 2×2, 입은 오른쪽 눈 아래 한 칸
          if ((x === -3 || x === -2) && (y === 4 || y === 5)) c = EYE;
          if ((x === 1 || x === 2) && (y === 4 || y === 5)) c = EYE;
          if (x === 1 && y === 2) c = MOUTH;
        }
        out.push({ x, y, z, c: css(c === EYE || c === MOUTH ? c : mottle(c, x, y, z)) });
      }
  return out;
}
const SLIME_KINDS = new Set(['slime', 'giant_slime', 'magma_cube', 'small_magma_cube']);
/**
 * 마그마 큐브 (2026-11-07, 마인크래프트 모습): 슬라임처럼 8×8×8 이지만 겉은 검붉은 껍데기에 주황빛 금이 가로로 두 줄,
 * 앞면에 주황 눈 둘(노란 눈동자). 슬라임처럼 통통 뛴다
 */
function magmaVoxels(): Voxel[] {
  const out: Voxel[] = [];
  for (let y = 0; y < 8; y++)
    for (let z = -4; z <= 3; z++)
      for (let x = -4; x <= 3; x++) {
        const shell = x === -4 || x === 3 || y === 0 || y === 7 || z === -4 || z === 3;
        let c = shell ? ((x * 7 + y * 3 + z * 5) % 5 === 0 ? 0x5a2016 : 0x3e1610) : 0xff8a1e; // 속은 이글이글
        if (shell && (y === 2 || y === 5) && (x * 3 + z) % 4 !== 0) c = y === 2 ? 0xe0661a : 0xff9a2a; // 주황 금
        if (z === -4 && (y === 4 || y === 5) && (x === -3 || x === -2 || x === 1 || x === 2)) c = y === 4 && (x === -2 || x === 1) ? 0xffe14a : 0xff6a1a; // 눈
        out.push({ x, y, z, c: `#${c.toString(16).padStart(6, '0')}` });
      }
  return out;
}
/** 번개 맞은 크리퍼처럼 (아빠 그림 2026-11-06): 크리퍼 몸을 감싼 푸른 번개 기운 — 반투명 상자 셋, MobView 가 깜빡인다 */
function chargedAura(body: THREE.Group): void {
  const auraMat = new THREE.MeshBasicMaterial({ color: 0x8fdcff, transparent: true, opacity: 0.28, depthWrite: false });
  for (const [w, h, d, y] of [
    [12, 10, 12, 21],
    [6, 14, 6, 11],
    [10, 8, 12, 3],
  ] as [number, number, number, number][]) {
    const aura = new THREE.Mesh(new THREE.BoxGeometry(w * VOXEL, h * VOXEL, d * VOXEL), auraMat);
    aura.position.set(-0.5 * VOXEL, y * VOXEL, -0.5 * VOXEL);
    body.add(aura);
  }
  body.userData.aura = auraMat;
}

const CREEPER_GREEN = 0x4caf50;
/** 사람 모양 몹 키 (좀비 주민 연출 글자 높이, #244) */
const MOB_SIZE_H = 1.9;
const SPIDER_DARK = 0x2a2320;
const ANIMAL_NAMES = new Set(['cow', 'pig', 'sheep', 'chicken', 'dog', 'horse', 'boat', 'minecart', 'cat', 'camel']); // 보트·수레도 동물 체계로 그린다 (#209·#237)
/** 원정 사냥 동물 (2026-11-05): 동물처럼 부위로 그리지만 상태는 몹 규칙(MOB_STATE)이라 따로 움직인다 */
const WILD_NAMES = new Set<string>(WILD_MODEL_KINDS);
const KING_DARK = 0x3a2344;
const KING_BELLY = 0x4a2a4e;
const GOLD = 0xffd54f;

function css(hex: number): string {
  return '#' + hex.toString(16).padStart(6, '0');
}

/** 가스트 복셀 (v1.1-3): 하얀 상자 16×16×16(앞면에 감은 눈·입) + 아래로 늘어진 촉수 아홉. MobView 에서 4.4배로 키운다. 앞이 −z */
function ghastVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  const pale = (x: number, y: number, z: number) => {
    const h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
    const k = 0.9 + (((h >>> 0) % 100) / 100) * 0.1;
    const v = Math.min(255, Math.round(0xe2 * k));
    return (v << 16) | (v << 8) | Math.min(255, v + 6);
  };
  const FACE = ['                ', '                ', '                ', '                ', '    xx    xx    ', '     xx  xx     ', '                ', '                ', '                ', '     xxxxxx     ', '    xx    xx    ', '                ', '                ', '                ', '                ', '                '];
  add(-8, 7, 9, 24, -8, 7, (x, y, z) => (z === -8 && FACE[24 - y]![x + 8] === 'x' ? 0x202020 : pale(x, y, z)));
  for (let i = 0; i < 9; i++) {
    const tx = -6 + (i % 3) * 5,
      tz = -6 + Math.floor(i / 3) * 5;
    const len = 5 + ((i * 7) % 4);
    add(tx, tx + 1, 9 - len, 8, tz, tz + 1, pale);
  }
  return out;
}

/** 블레이즈 복셀 (v1.1-3): 어두운 노란 머리 8×8×8(얼굴은 밝은 눈) + 둘레를 도는 불 막대 8개(2×6×2) 두 층. 앞이 −z */
function blazeVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  add(-4, 3, 18, 25, -4, 3, (x, y, z) => (z === -4 && y === 22 && (x === -3 || x === -2 || x === 1 || x === 2) ? 0xfff2a0 : 0x5a4210));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rx = Math.round(Math.cos(a) * 5),
      rz = Math.round(Math.sin(a) * 5);
    const y0 = i % 2 === 0 ? 10 : 4;
    add(rx - 1, rx, y0, y0 + 5, rz - 1, rz, (_x, y) => (y % 3 === 0 ? 0xffd54f : 0xf2a21a));
  }
  return out;
}

/** 크리퍼 복셀: 머리 8×8×8 (앞면에 검은 얼굴), 몸 4×12×4, 다리 4개 4×6×4. 앞이 −z */
function creeperVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  // 크리퍼 얼룩 (아빠가 보낸 그림 2026-11-06): 여러 초록이 섞이고 군데군데 잿빛·흰 칸. 발 아래 두 줄은 거의 검다
  const SPOTS = [0x2f8a26, 0x3fa52f, 0x55bf3d, 0x6cd04d, 0x86dc6a, 0x1f6b1a, 0x9fb59a, 0xd9e6d6];
  const mottle = (x: number, y: number, z: number) => {
    const h = (((x + 9) * 73856093) ^ ((y + 3) * 19349663) ^ ((z + 9) * 83492791)) >>> 0;
    const r = h % 100;
    if (y <= 1) return r < 50 ? 0x14301a : 0x1f4a22; // 발바닥
    return SPOTS[r < 22 ? 1 : r < 40 ? 2 : r < 54 ? 0 : r < 66 ? 3 : r < 76 ? 4 : r < 86 ? 5 : r < 94 ? 6 : 7]!;
  };
  // 다리 넷 (앞 두 개, 뒤 두 개)
  for (const [lx, lz] of [
    [-4, -4],
    [0, -4],
    [-4, 1],
    [0, 1],
  ] as [number, number][])
    add(lx, lx + 3, 0, 5, lz, lz + 3, mottle);
  // 몸통 4×12×4 (x -2..1, z -2..1)
  add(-2, 1, 6, 17, -2, 1, mottle);
  // 머리 8×8×8 (x -4..3, z -4..3), 앞면 z=-4 에 얼굴
  const FACE = ['        ', '        ', ' xx  xx ', ' xx  xx ', '   xx   ', '  xxxx  ', '  x  x  ', '  x  x  '];
  add(-4, 3, 18, 25, -4, 3, (x, y, z) => {
    if (z === -4 && FACE[25 - y]![x + 4] === 'x') return (x + y) % 3 === 0 ? 0x1c2a1c : 0x0a0f0a; // 얼굴 (검정에 살짝 얼룩)
    return mottle(x, y, z);
  });
  return out;
}

/** 거미 몸통 복셀: 머리 8×8×6 (앞면 z=-11 에 붉은 눈 여덟), 가슴 6×6×6, 배 10×8×12. 앞이 −z, 바닥 y 0 은 다리 끝. king 이면 자줏빛 + 금 왕관 */
function spiderBodyVoxels(king = false): Voxel[] {
  const dark = king ? KING_DARK : SPIDER_DARK;
  const belly = king ? KING_BELLY : 0x3a2f2a;
  const out: Voxel[] = [];
  const mottle = (x: number, y: number, z: number, base: number) => {
    const h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
    const k = 0.85 + (((h >>> 0) % 100) / 100) * 0.3;
    const r = Math.min(255, Math.round(((base >> 16) & 255) * k)),
      g = Math.min(255, Math.round(((base >> 8) & 255) * k)),
      b = Math.min(255, Math.round((base & 255) * k));
    return (r << 16) | (g << 8) | b;
  };
  const add = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, color: (x: number, y: number, z: number) => number) => {
    for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  // 배 (뒤, 크다)
  add(-5, 4, 5, 12, 1, 12, (x, y, z) => mottle(x, y, z, belly));
  // 가슴
  add(-3, 2, 6, 11, -5, 0, (x, y, z) => mottle(x, y, z, dark));
  // 머리 + 눈
  const EYES = ['        ', ' r    r ', 'r r  r r', ' r    r ', '  r  r  ', '        ', '        ', '        '];
  add(-4, 3, 5, 12, -11, -6, (x, y, z) => {
    if (z === -11 && EYES[12 - y]![x + 4] === 'r') return king ? 0xff3030 : 0xd02020;
    return mottle(x, y, z, dark);
  });
  if (king) {
    // 왕관 — 아들 그림(13차, 2026-10-07, #127): 금 테(13) + 앞쪽 뿔 셋(왼·가운데 2칸, 오른쪽이 제일 높다 3칸),
    // 보석 여섯: 위에 초록·하늘·초록, 아래 파랑·빨강·파랑 (앞면에만)
    const GEM: Record<string, number> = { g: 0x43d13a, c: 0x29e3ff, b: 0x1e3cff, r: 0xe53935 };
    const FRONT_GEMS: Record<number, Record<number, string>> = { 13: { [-4]: 'b', 0: 'r', 3: 'b' }, 14: { [-3]: 'g', 0: 'c' }, 15: { 3: 'g' } };
    const gemAt = (x: number, y: number, z: number) => (z === -11 ? FRONT_GEMS[y]?.[x] : undefined);
    for (let z = -11; z <= -6; z++)
      for (let x = -4; x <= 3; x++) {
        const edge = z === -11 || z === -6 || x === -4 || x === 3;
        if (!edge) continue;
        const g = gemAt(x, 13, z);
        out.push({ x, y: 13, z, c: css(g ? GEM[g]! : GOLD) });
      }
    const SPIKES: readonly (readonly [number, number, number])[] = [
      [-4, -3, 15],
      [-1, 0, 15],
      [2, 3, 16],
    ]; // x0, x1, 꼭대기 y
    for (const [x0, x1, top] of SPIKES)
      for (let x = x0; x <= x1; x++)
        for (let y = 14; y <= top; y++)
          for (let z = -11; z <= -10; z++) {
            const g = gemAt(x, y, z);
            out.push({ x, y, z, c: css(g ? GEM[g]! : GOLD) });
          }
  }
  return out;
}

/** 거미 다리 하나: 가로 14×2×2 막대 (x 0..13), 몸에 붙는 쪽이 x 0 */
/** 눈 골렘 (#223): 눈덩이 둘 위에 조각된 호박 머리, 나뭇가지 팔. 1칸 = 1/16, 키 20칸 */
function snowGolemVoxels(): Voxel[] {
  const out: Voxel[] = [];
  const fill = (x0: number, y0: number, z0: number, w: number, h: number, d: number, color: (x: number, y: number, z: number) => number) => {
    for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) for (let z = z0; z < z0 + d; z++) out.push({ x, y, z, c: css(color(x, y, z)) });
  };
  const snow = (x: number, y: number, z: number) => ((x * 3 + y * 5 + z * 7) & 7) === 0 ? 0xe4edf3 : 0xf7fbff;
  fill(-4, 0, -4, 8, 8, 8, snow); // 아래 눈덩이
  fill(-3, 8, -3, 6, 6, 6, snow); // 가운데 눈덩이
  fill(-3, 14, -3, 6, 6, 6, (x, y, z) => {
    // 조각된 호박 머리: 앞면(-z)에 눈·입
    if (z === -3 && ((y === 17 && (x === -2 || x === 1)) || (y === 15 && x >= -1 && x <= 0))) return 0x1a1208;
    return ((x + y + z) & 1) === 0 ? 0xd98a2b : 0xc97a22;
  });
  fill(-8, 11, -1, 4, 1, 1, () => 0x6b4a2a); // 나뭇가지 팔
  fill(4, 11, -1, 4, 1, 1, () => 0x6b4a2a);
  return out;
}

function spiderLegVoxels(): Voxel[] {
  const out: Voxel[] = [];
  for (let x = 0; x < 14; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) out.push({ x, y, z, c: css(x > 9 ? 0x1a1614 : 0x241e1b) });
  return out;
}

/** 캔버스 스프라이트 (체력 바·피해 숫자). 그리기는 draw 가 맡는다 */
function canvasSprite(w: number, h: number, scaleW: number, scaleH: number): { sprite: THREE.Sprite; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: true, transparent: true }));
  sprite.scale.set(scaleW, scaleH, 1);
  return { sprite, ctx, tex };
}

function drawHpBar(ctx: CanvasRenderingContext2D, tex: THREE.CanvasTexture, hp: number, max: number): void {
  const w = ctx.canvas.width,
    h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 6, w, h - 12);
  const ratio = Math.max(0, Math.min(1, hp / Math.max(1, max)));
  ctx.fillStyle = ratio > 0.5 ? '#e53935' : ratio > 0.25 ? '#fb8c00' : '#ffd600';
  ctx.fillRect(3, 9, (w - 6) * ratio, h - 18);
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = 'rgba(0,0,0,0.8)';
  ctx.lineWidth = 3;
  ctx.strokeText(`${hp} / ${max}`, w / 2, h / 2);
  ctx.fillText(`${hp} / ${max}`, w / 2, h / 2);
  tex.needsUpdate = true;
}

function partMesh(voxels: readonly Voxel[], material: THREE.Material): THREE.Mesh {
  const geom = buildVoxelGeometry(voxels, VOXEL, PLAYER_SHADES);
  geom.translate(VOXEL / 2, 0, VOXEL / 2);
  return new THREE.Mesh(geom, material);
}
/** 사냥 동물 모델 한 덩어리 (낚아 올리는 연어 연출 등, 2026-11-06): 몸 + 머리 + 꼬리. 꼬리는 userData.tail */
export function wildFigureMesh(kind: string): THREE.Group | null {
  const parts = wildParts(kind);
  if (!parts) return null;
  const material = new THREE.MeshBasicMaterial({ vertexColors: true });
  const g = new THREE.Group();
  g.add(partMesh(parts.body, material));
  g.add(pivotMesh(parts.head, material));
  if (parts.tail) {
    const t = pivotMesh(parts.tail, material);
    g.add(t);
    g.userData.tail = t;
  }
  return g;
}
/** 회전 축이 있는 부위 (동물 머리·다리·꼬리·날개): 축이 메시 원점, 메시는 축 자리에 놓인다 */
function pivotMesh(p: Part, material: THREE.Material): THREE.Mesh {
  const geom = buildVoxelGeometry(p.v, VOXEL, PLAYER_SHADES);
  geom.translate((0.5 - p.pivot[0]) * VOXEL, -p.pivot[1] * VOXEL, (0.5 - p.pivot[2]) * VOXEL);
  const mesh = new THREE.Mesh(geom, material);
  mesh.position.set(p.pivot[0] * VOXEL, p.pivot[1] * VOXEL, p.pivot[2] * VOXEL);
  return mesh;
}

interface Figure {
  group: THREE.Group;
  body: THREE.Group;
  material: THREE.MeshBasicMaterial;
  kind: number;
  cur: { x: number; y: number; z: number; yaw: number };
  target: { x: number; y: number; z: number; yaw: number };
  state: number;
  hp: number;
  flashUntil: number;
  fuseT: number;
  armL: THREE.Mesh | null;
  armR: THREE.Mesh | null;
  legL: THREE.Mesh | null;
  legR: THREE.Mesh | null;
  /** 거미 다리 여덟 (왼 넷, 오른 넷) */
  spiderLegs: THREE.Mesh[];
  walk: number;
  /** 머리 위 체력 바 */
  bar: { sprite: THREE.Sprite; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture };
  maxHp: number;
  shownHp: number;
  /** 몸 크기 배율 (거미 왕 2.2) */
  baseScale: number;
  /** 종류별 몸 크기 (엔더맨 0.8·1.5·0.8, 가스트 4.4 …). 매 프레임 이것에 잠·아기·소환 배율을 곱한다 (#254 — 전엔 baseScale 로 덮어써서 다 보통 크기였다) */
  scaleV: THREE.Vector3;
  /** 소환 연출 남은 시간 */
  summonT: number;
  /** 동물인가 (M8-1) */
  animal: boolean;
  collar: THREE.Mesh | null;
  /** 깎인 양으로 그렸나 — 바뀌면 인형을 다시 만든다 */
  sheared: boolean;
  /** 펫 이름표 (#109) */
  nameLabel: { sprite: THREE.Sprite; text: string } | null;
  /** 동물 부위 (앞왼·앞오른·뒤왼·뒤오른 다리 / 닭은 둘) */
  legs: THREE.Mesh[];
  head: THREE.Mesh | null;
  tail: THREE.Mesh | null;
  wings: THREE.Mesh[];
  babyHead: number;
  id: number;
  /** 사랑 하트 다음 시각 */
  nextHeart: number;
}

/** 떠오르는 피해 숫자 */
interface Pop {
  sprite: THREE.Sprite;
  born: number;
}

interface Burst {
  group: THREE.Group;
  born: number;
  parts: { m: THREE.Mesh; v: THREE.Vector3 }[];
}

const BURST_GEOM = new THREE.BoxGeometry(0.16, 0.16, 0.16);
/** 화살 막대 (M8-2): 앞(−z → lookAt 방향)으로 긴 상자 */
const SHOT_GEOM = new THREE.BoxGeometry(0.06, 0.06, 0.7);
/** 던진 물약 병 (#245) */
const BOTTLE_GEOM = new THREE.BoxGeometry(0.22, 0.3, 0.22);
const SHOT_MAT = new THREE.MeshBasicMaterial({ color: 0xd9c8a0 });
/** 불덩이 (#173): 가스트·블레이즈가 쏜다. 주황 공, 화살보다 천천히(0.45초) */
const FIRE_GEOM = new THREE.SphereGeometry(0.3, 8, 6);
const FIRE_MAT = new THREE.MeshBasicMaterial({ color: 0xff8a2a });
/** 눈 골렘 눈덩이 (#223): 하얀 공 */
const SNOW_GEOM = new THREE.SphereGeometry(0.16, 6, 6);
const SNOW_MAT = new THREE.MeshBasicMaterial({ color: 0xf4f9ff });
/** 거대 워든 음파 (#254): 크고 푸른 고리 */
const SONIC_GEOM = new THREE.TorusGeometry(0.5, 0.12, 6, 12);
const SONIC_MAT = new THREE.MeshBasicMaterial({ color: 0x3df0ff, transparent: true, opacity: 0.85 });
/** 셜커 탄 (2026-11-07): 하얗게 빛나는 작은 공 */
const BULLET_MAT = new THREE.MeshBasicMaterial({ color: 0xf2e6ff });
/** 브리즈 돌풍 (2026-11-07): 하얀 바람 고리 */
const WIND_MAT = new THREE.MeshBasicMaterial({ color: 0xe6f2ff, transparent: true, opacity: 0.7 });

export class MobView {
  /** 내 자리 (호랑이가 몰래 다가오는지 보려고, 2026-11-06) */
  viewer: { x: number; z: number } | null = null;
  /** 지금 있는 원정지 id (마을이면 null) — 사막 좀비 주민처럼 곳마다 다른 옷 (2026-11-06) */
  place: string | null = null;
  private readonly group = new THREE.Group();
  readonly figures = new Map<number, Figure>();
  private readonly bursts: Burst[] = [];
  private readonly pops: Pop[] = [];
  /** 날아가는 화살 (M8-2): 0.25초 동안 from → to */
  private readonly shots: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; born: number; ms: number; fire: boolean; splash?: number; beam?: boolean }[] = [];
  /** 불덩이가 닿아 터질 때 (#215): Game 이 소리를 붙인다 */
  onFireHit: (() => void) | null = null;
  /** 잔류형 물약 구름 (#246): 바닥에 그 색 조각들이 천천히 돈다. radius 는 서버가 줄일 때마다 다시 오고, 그 사이엔 30초에 1칸씩 줄어든 것으로 그린다. at·until 은 update 의 시계 — at < 0 이면 다음 update 에서 맞춘다 */
  private readonly clouds = new Map<number, { group: THREE.Group; parts: THREE.Mesh[]; x: number; y: number; z: number; radius: number; at: number; until: number; leftMs: number; seed: number }>();

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  get count(): number {
    return this.figures.size;
  }

  /** 펫 이름 (#109): id → 이름. 이름표는 setState 에서 붙인다 */
  private readonly petNames = new Map<number, string>();
  setPetNames(list: readonly { id: number; name: string | null }[]): void {
    this.petNames.clear();
    for (const p of list) if (p.name) this.petNames.set(p.id, p.name);
    for (const [id, f] of this.figures) this.applyName(id, f);
  }
  private applyName(id: number, f: Figure): void {
    const name = this.petNames.get(id) ?? null;
    if (f.nameLabel && f.nameLabel.text === name) return;
    if (f.nameLabel) {
      f.group.remove(f.nameLabel.sprite);
      (f.nameLabel.sprite.material as THREE.SpriteMaterial).map?.dispose();
      f.nameLabel.sprite.material.dispose();
      f.nameLabel = null;
    }
    if (!name) return;
    const villager = MOB_KIND_OF[f.kind] === 'villager';
    const sprite = nameSprite(`${villager ? '🧑‍🌾' : '🐾'} ${name}`, villager ? 'rgba(40,60,30,0.55)' : 'rgba(60,30,10,0.55)', 0.4);
    sprite.position.set(0, mobSize(f.kind).h + 0.55, 0);
    f.group.add(sprite);
    f.nameLabel = { sprite, text: name };
  }

  /** 몹의 지금 자리 (가슴 높이). 없으면 null */
  positionOf(id: number): { x: number; y: number; z: number } | null {
    const f = this.figures.get(id);
    return f ? { x: f.cur.x, y: f.cur.y + mobSize(f.kind).h * 0.5 * (f.state & ANIMAL_FLAG.baby ? 0.5 : 1), z: f.cur.z } : null;
  }

  /** 겹치지 않게 (아빠 2026-11-05): (x, z) 에서 range 칸 안 몹·동물 몸을 out 에 넣는다. 서버가 움직이니 fixed — 내가 다 비킨다 */
  bodiesNear(x: number, z: number, range: number, out: SepBody[]): void {
    for (const f of this.figures.values()) {
      if (Math.abs(f.cur.x - x) > range || Math.abs(f.cur.z - z) > range) continue;
      const s = mobSize(f.kind);
      const k = f.animal && f.state & ANIMAL_FLAG.baby ? 0.5 : 1;
      out.push({ x: f.cur.x, y: f.cur.y, z: f.cur.z, r: (s.w / 2) * k, h: s.h * k, fixed: true });
    }
  }

  /** 화살 연출 (M8-2): 눈에서 몹까지 가느다란 막대가 날아간다 */
  shot(from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, fire = false, snow = false, sonic = false, laser = false, potion = false, bullet = false, wind = false): void {
    if (laser) {
      // 가디언 빛줄기 (2026-11-06): 몹에서 사람까지 이어진 보랏빛 줄이 잠깐 머문다
      const f = new THREE.Vector3(from.x, from.y, from.z),
        t = new THREE.Vector3(to.x, to.y, to.z);
      const len = f.distanceTo(t);
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, len), new THREE.MeshBasicMaterial({ color: 0xc58cff, transparent: true, opacity: 0.85 }));
      beam.position.copy(f).lerp(t, 0.5);
      beam.lookAt(t);
      this.group.add(beam);
      this.shots.push({ mesh: beam, from: beam.position.clone(), to: beam.position.clone(), born: -1, ms: 450, fire: false, beam: true });
      return;
    }
    if (potion) {
      this.splash(from, to, 0x4e9a2e); // 마녀 독 물약 (2026-11-06)
      return;
    }
    const mesh = bullet ? new THREE.Mesh(SNOW_GEOM, BULLET_MAT) : wind ? new THREE.Mesh(SONIC_GEOM, WIND_MAT) : fire ? new THREE.Mesh(FIRE_GEOM, FIRE_MAT) : snow ? new THREE.Mesh(SNOW_GEOM, SNOW_MAT) : sonic ? new THREE.Mesh(SONIC_GEOM, SONIC_MAT) : new THREE.Mesh(SHOT_GEOM, SHOT_MAT);
    const f = new THREE.Vector3(from.x, from.y, from.z),
      t = new THREE.Vector3(to.x, to.y, to.z);
    mesh.position.copy(f);
    mesh.lookAt(t);
    this.group.add(mesh);
    this.shots.push({ mesh, from: f, to: t, born: -1, ms: bullet ? 800 : fire ? 450 : sonic || wind ? 400 : 250, fire }); // 셜커 탄은 천천히 따라온다
  }

  /** 던진 물약 (#245): 병이 포물선 없이 날아가 떨어진 자리에서 그 색으로 흩어진다 */
  splash(from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, color: number): void {
    const mesh = new THREE.Mesh(BOTTLE_GEOM, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
    const f = new THREE.Vector3(from.x, from.y, from.z),
      t = new THREE.Vector3(to.x, to.y, to.z);
    mesh.position.copy(f);
    this.group.add(mesh);
    this.shots.push({ mesh, from: f, to: t, born: -1, ms: 350, fire: false, splash: color });
  }

  /** 잔류형 구름 (#246): 새로 생기거나 반지름이 바뀌었다. leftMs 뒤에 사라진다 */
  cloud(id: number, at: { x: number; y: number; z: number }, color: number, radius: number, leftMs: number): void {
    let c = this.clouds.get(id);
    if (!c) {
      const group = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
      const parts: THREE.Mesh[] = [];
      for (let i = 0; i < 28; i++) {
        const m = new THREE.Mesh(BURST_GEOM, mat);
        parts.push(m);
        group.add(m);
      }
      this.group.add(group);
      c = { group, parts, x: at.x, y: at.y, z: at.z, radius, at: -1, until: 0, leftMs, seed: id * 1.7 };
      this.clouds.set(id, c);
    }
    c.radius = radius;
    c.at = -1;
    c.leftMs = leftMs;
  }

  cloudGone(id: number): void {
    const c = this.clouds.get(id);
    if (!c) return;
    this.group.remove(c.group);
    (c.parts[0]!.material as THREE.Material).dispose();
    this.clouds.delete(id);
  }

  /** 조준 안내용: 그 몹의 종류·상태 */
  figureOf(id: number): { kind: number; state: number } | undefined {
    const f = this.figures.get(id);
    return f ? { kind: f.kind, state: f.state } : undefined;
  }

  private make(m: MobEntry): Figure {
    const material = new THREE.MeshBasicMaterial({ vertexColors: true });
    const group = new THREE.Group();
    const body = new THREE.Group();
    let armL: THREE.Mesh | null = null,
      armR: THREE.Mesh | null = null,
      legL: THREE.Mesh | null = null,
      legR: THREE.Mesh | null = null;
    const spiderLegs: THREE.Mesh[] = [];
    const legs: THREE.Mesh[] = [];
    const wings: THREE.Mesh[] = [];
    let head: THREE.Mesh | null = null,
      tail: THREE.Mesh | null = null;
    let babyHead = 1;
    const kindName = MOB_KIND_OF[m.kind] ?? 'zombie';
    const pal = HUMANOID[kindName];
    const skel = SKELETON_KIND_OF[kindName]; // 스켈레톤 무리 (아빠 그림 2026-11-06): 가는 뼈·갈비·활/검
    const ender = kindName === 'enderman' || kindName === 'enderman_king'; // 엔더맨 (아빠 그림): 길고 가는 팔다리
    const zk = zombieKindOf(kindName, this.place === 'desert'); // 좀비 가족 (아빠 그림): 좀비·아기 좀비·좀비 주민(사막이면 두건)·허스크·드라운드·프로스트바이트
    if (pal || skel || ender || zk) {
      const sk = skel ? skeletonVoxels(skel) : null;
      const v = sk ?? (zk ? zombieVoxels(zk) : ender ? endermanVoxels() : kindName === 'witch' ? witchVoxels() : playerVoxels(pal!)); // 마녀는 주민 모양 (아빠 그림)
      const at = (mesh: THREE.Mesh, spot: readonly [number, number]) => {
        mesh.position.set(spot[0] * VOXEL, spot[1] * VOXEL, 0);
        return mesh;
      };
      type Spot = readonly [number, number];
      const S: Record<'torso' | 'head' | 'legL' | 'legR' | 'armL' | 'armR', Spot> = ender ? ENDERMAN_SPOTS : { torso: [0, 12], head: [0, 24], legL: [-2, 12], legR: [2, 12], armL: sk ? [-5, 24] : [-6, 24], armR: sk ? [5, 24] : [6, 24] }; // 스켈레톤은 팔이 가늘어 어깨가 안쪽
      const torso = at(partMesh(v.torso, material), S.torso);
      const head = at(partMesh(v.head, material), S.head);
      legL = at(partMesh(v.leg, material), S.legL);
      legR = at(partMesh(v.leg, material), S.legR);
      armL = at(partMesh(v.arm, material), S.armL);
      armR = at(partMesh(v.arm, material), S.armR);
      if (sk) {
        armR.add(partMesh(sk.item, material)); // 활·돌 검
        armR.rotation.x = -0.35; // 든 손을 살짝 앞으로
      }
      if (ender) body.userData.ender = true; // 보라 가루
      if (zk || kindName === 'zombified_piglin') armL.rotation.x = armR.rotation.x = -Math.PI / 2 + 0.15; // 좀비 팔은 앞으로
      if (kindName === 'baby_zombie') head.scale.setScalar(1.6); // 아기 좀비는 머리가 크다
      else if (kindName === 'evoker') armL.rotation.x = armR.rotation.x = -Math.PI / 2 + 0.6; // 소환사는 손을 든다
      body.add(torso, head, legL, legR, armL, armR);
      if (kindName.endsWith('_king')) head.add(partMesh(crownVoxels(8), material)); // 머리 조각 기준 윗면 y 8
      if (kindName === 'witch') {
        head.add(partMesh(witchHatVoxels(10), material)); // 키 큰 머리 위
        armL.rotation.x = armR.rotation.x = -1.15; // 팔짱 (주민처럼 앞으로 모은다)
        armL.rotation.z = -0.35;
        armR.rotation.z = 0.35;
      }
    } else if (MOB_KIND_OF[m.kind] === 'spider' || MOB_KIND_OF[m.kind] === 'spider_king') {
      body.add(partMesh(spiderBodyVoxels(MOB_KIND_OF[m.kind] === 'spider_king'), material));
      const legGeom = buildVoxelGeometry(spiderLegVoxels(), VOXEL, PLAYER_SHADES);
      legGeom.translate(0, -VOXEL, -VOXEL); // 붙는 쪽 끝이 원점
      for (let i = 0; i < 8; i++) {
        const right = i >= 4;
        const k = i % 4;
        const leg = new THREE.Mesh(legGeom, material);
        leg.position.set((right ? 3 : -3) * VOXEL, 9 * VOXEL, (-4 + k * 3) * VOXEL);
        // 바깥으로 뻗고(y) 아래로 처진다(z). 앞다리는 앞으로, 뒷다리는 뒤로
        leg.rotation.set(0, (right ? 0 : Math.PI) + (right ? 1 : -1) * (0.55 - k * 0.37), right ? -0.75 : 0.75);
        leg.userData.baseY = leg.rotation.y;
        spiderLegs.push(leg);
        body.add(leg);
      }
    } else if (kindName === 'snow_golem') {
      body.add(partMesh(snowGolemVoxels(), material)); // 눈 골렘 (#223)
    } else if (WILD_NAMES.has(kindName)) {
      const parts = wildParts(kindName, kindName === 'elephant' ? (m.id % 4 === 0 ? 1 : 0) : animalVariant(m.id))!; // 열대어는 번호마다 모양·색이 다르다, 코끼리는 무리(번호 넷)마다 하나가 긴 상아 대장
      const small = partMesh(parts.body, material);
      body.add(small);
      if (kindName === 'pufferfish') {
        // 복어 (2026-11-06): 부푼 가시 공은 따로 만들어 두고, 서버가 attack 이면 바꿔 보인다
        const big = partMesh(pufferPuffedVoxels(), material);
        big.visible = false;
        body.add(big);
        body.userData.puff = { big, small };
      }
      head = pivotMesh(parts.head, material);
      body.add(head);
      if (kindName === 'tiger') {
        // 몰래 다가올 때 보이는 붉은 눈 (몸은 투명해진다) — 따로 된 재질이라 안 흐려진다
        const glow = pivotMesh({ v: tigerGlowEyes(), pivot: parts.head.pivot }, new THREE.MeshBasicMaterial({ vertexColors: true }));
        glow.position.set(0, 0, 0);
        glow.visible = false;
        head.add(glow);
        body.userData.stalkEyes = glow;
      }
      for (const l of parts.legs) {
        const mesh = pivotMesh(l, material);
        legs.push(mesh);
        body.add(mesh);
      }
      if (parts.tail) {
        tail = pivotMesh(parts.tail, material);
        body.add(tail);
      }
      for (const w of parts.wings) {
        const mesh = pivotMesh(w, material);
        wings.push(mesh);
        body.add(mesh);
      }
    } else if (ANIMAL_NAMES.has(kindName)) {
      const parts = animalParts(kindName, animalVariant(m.id), { sheared: (m.state & ANIMAL_FLAG.sheared) !== 0 });
      body.add(partMesh(parts.body, material));
      head = pivotMesh(parts.head, material);
      body.add(head);
      for (const l of parts.legs) {
        const mesh = pivotMesh(l, material);
        legs.push(mesh);
        body.add(mesh);
      }
      if (parts.tail) {
        tail = pivotMesh(parts.tail, material);
        body.add(tail);
      }
      for (const w of parts.wings) {
        const mesh = pivotMesh(w, material);
        wings.push(mesh);
        body.add(mesh);
      }
      babyHead = parts.babyHead;
    } else if (kindName === 'gorilla' || kindName === 'giant_gorilla' || kindName === 'warden' || kindName === 'giant_warden' || kindName === 'ravager') {
      // 고릴라 (#253, 참고 그림): 흰 털 네발 자세 / 워든 (#254, 참고 그림): 빛나는 뿔·가슴의 영혼. 팔·다리·머리는 축이 있는 부위라 걷고 내리친다
      const parts = kindName === 'ravager' ? ravagerParts() : kindName.endsWith('gorilla') ? gorillaParts() : wardenParts(); // 파괴수 (아빠 그림 2026-11-06)
      body.add(partMesh(parts.body, material));
      head = pivotMesh(parts.head, material);
      body.add(head);
      for (const l of parts.legs) {
        const mesh = pivotMesh(l, material);
        legs.push(mesh);
        body.add(mesh);
      }
    } else if (kindName === 'ender_dragon') {
      // 엔더 드래곤 (v1.1-4): 아들의 엔더 드래곤 복셀(둥지 어른)을 2.5배로
      const dm = dragonMesh('ender', 'adult');
      dm.scale.setScalar(2.5);
      body.add(dm);
    } else if (kindName === 'guardian' || kindName === 'elder_guardian') {
      const elder = kindName === 'elder_guardian';
      body.add(partMesh(guardianVoxels(elder, 'body'), material));
      const long = partMesh(guardianVoxels(elder, 'long'), material);
      const short = partMesh(guardianVoxels(elder, 'short'), material);
      short.visible = false;
      body.add(long, short);
      body.userData.spikes = { long, short }; // 공격할 땐 가시를 움츠린다 (아빠 그림)
    } else if (SLIME_KINDS.has(kindName)) {
      body.add(partMesh(kindName.includes('magma') ? magmaVoxels() : slimeVoxels(), material));
    } else if (kindName === 'creeper_king') {
      body.add(partMesh(creeperVoxels(), material));
      body.add(partMesh(crownVoxels(26), material));
      chargedAura(body);
    } else if (kindName === 'charged_creeper') {
      body.add(partMesh(creeperVoxels(), material));
      chargedAura(body);
    } else if (kindName === 'endermite') {
      body.add(partMesh(endermiteVoxels(), material));
      body.userData.ender = true; // 보라 가루
    } else if (kindName === 'ghast') {
      body.add(partMesh(ghastVoxels(), material));
    } else if (kindName === 'blaze') {
      body.add(partMesh(blazeVoxels(), material));
    } else {
      body.add(partMesh(creeperVoxels(), material));
    }
    group.add(body);
    // 체력 바: 머리 위, 몸과 따로(돌지도 커지지도 않는다)
    const maxHp = MOBS.get(kindName).hp;
    const king = MOB_KIND_OF[m.kind] === 'spider_king';
    const big = king || kindName === 'sperm_whale' || kindName === 'ender_dragon' || kindName === 'ghast' || kindName === 'giant_gorilla' || kindName === 'giant_warden' || kindName === 'elder_guardian' || kindName === 'giant_slime' || kindName.endsWith('_king');
    const baseScale = king ? 2.2 : 1;
    body.scale.setScalar(baseScale);
    if (kindName === 'wither_skeleton') body.scale.set(1.1, 1.3, 1.1); // 위더 스켈레톤은 크다
    else if (kindName === 'iron_golem') body.scale.set(1.5, 1.45, 1.5);
    else if (kindName === 'ghast') body.scale.setScalar(4.4); // 네 칸짜리 상자
    else if (kindName === 'gorilla') body.scale.setScalar(1.4); // 정글 (#253): 사람(1.8m)보다 큰 2.2m
    else if (kindName === 'giant_gorilla') body.scale.setScalar(2.8); // 그 두 배
    else if (kindName === 'giant_warden') body.scale.setScalar(2); // 깊은 어둠 (#254): 워든(2.8m)의 두 배
    // 2026-11-06 원정지 셋: 판정 크기(MOB_SIZES)에 맞춘다
    else if (kindName === 'guardian') body.scale.setScalar(1.15);
    else if (kindName === 'elder_guardian') body.scale.setScalar(2.8);
    else if (kindName === 'slime' || kindName === 'magma_cube') body.scale.setScalar(2.2);
    else if (kindName === 'small_magma_cube') body.scale.setScalar(1.1);
    else if (kindName === 'giant_slime') body.scale.setScalar(7);
    else if (kindName === 'skeleton_king' || kindName === 'zombie_king') body.scale.setScalar(3);
    else if (kindName === 'creeper_king') body.scale.setScalar(3.3);
    else if (kindName === 'baby_zombie') body.scale.setScalar(0.5);
    else if (kindName === 'polar_bear_cub') body.scale.setScalar(0.5); // 아기 북극곰 (2026-11-07)
    else if (kindName === 'endermite') body.scale.setScalar(1.8);
    else if (kindName === 'sperm_whale') body.scale.setScalar(2); // 길이 10칸쯤
    else if (kindName === 'enderman_king') body.scale.setScalar(2.5); // 엔더맨(2.8m)의 2.5배
    const bar = canvasSprite(128, 28, big ? 2.2 : 1.1, big ? 0.4 : 0.24);
    bar.sprite.position.set(0, mobSize(m.kind).h + (big ? 0.7 : 0.35), 0);
    drawHpBar(bar.ctx, bar.tex, m.hp, maxHp);
    group.add(bar.sprite);
    this.group.add(group);
    return { group, body, material, kind: m.kind, cur: { x: m.x, y: m.y, z: m.z, yaw: m.yaw }, target: { x: m.x, y: m.y, z: m.z, yaw: m.yaw }, state: m.state, hp: m.hp, flashUntil: 0, fuseT: 0, armL, armR, legL, legR, spiderLegs, walk: 0, bar, maxHp, shownHp: m.hp, baseScale, scaleV: body.scale.clone(), summonT: 0, animal: ANIMAL_NAMES.has(kindName), collar: null, nextHeart: 0, legs, head, tail, wings, babyHead, id: m.id, sheared: (m.state & ANIMAL_FLAG.sheared) !== 0, nameLabel: null };
  }

  /** 서버 상태 묶음 (20Hz). 목록에 없는 몹은 지운다 */
  setState(list: readonly MobEntry[]): void {
    const seen = new Set<number>();
    for (const m of list) {
      seen.add(m.id);
      let f = this.figures.get(m.id);
      if (f && (f.kind !== m.kind || (f.animal && f.sheared !== ((m.state & ANIMAL_FLAG.sheared) !== 0)))) {
        // 털이 깎였다/다시 자랐다, 또는 종류가 바뀌었다(주민 ↔ 좀비 주민 #244) → 인형을 새로 (자리는 그대로)
        const keep = f.cur;
        this.remove(m.id);
        f = this.make(m);
        f.cur = { ...keep };
        f.group.position.set(keep.x, keep.y, keep.z);
        this.figures.set(m.id, f);
      }
      if (!f) {
        f = this.make(m);
        f.group.position.set(m.x, m.y, m.z);
        this.figures.set(m.id, f);
      }
      if (f.animal && (this.petNames.has(m.id) || f.nameLabel)) this.applyName(m.id, f);
      f.target = { x: m.x, y: m.y, z: m.z, yaw: m.yaw };
      f.state = m.state;
      f.hp = m.hp;
      if (f.shownHp !== m.hp) {
        f.shownHp = m.hp;
        drawHpBar(f.bar.ctx, f.bar.tex, m.hp, f.maxHp);
      }
      if (FISH_MODEL_KINDS.has(MOB_KIND_OF[m.kind] ?? '')) f.bar.sprite.visible = m.hp < f.maxHp; // 물고기도 다쳤을 때만 (물 위에 바가 둥둥 뜨지 않게)
      if (MOB_KIND_OF[m.kind] === 'creaking') f.bar.sprite.visible = false; // 크리킹은 안 다친다 — 심장을 부숴야 (2026-11-07)
      if (f.animal) {
        f.bar.sprite.visible = m.hp < f.maxHp; // 동물은 다쳤을 때만 체력 바
        const tamed = (m.state & ANIMAL_FLAG.tamed) !== 0;
        if (!tamed && f.collar) {
          // 야생으로 풀어줬다 (2026-11-06): 목걸이를 뗀다
          f.body.remove(f.collar);
          f.collar.geometry.dispose();
          f.collar = null;
        }
        if (tamed && !f.collar) {
          f.collar = partMesh(collarVoxels(MOB_KIND_OF[m.kind] ?? 'dog'), new THREE.MeshBasicMaterial({ vertexColors: true }));
          f.body.add(f.collar);
        }
      }
    }
    for (const id of [...this.figures.keys()]) if (!seen.has(id)) this.remove(id);
  }

  /** 서버 mob 이벤트. hit 이면 dmg 만큼 피해 숫자가 떠오른다 */
  event(ev: string, id: number, x: number, y: number, z: number, now = performance.now(), dmg?: number): void {
    const f = this.figures.get(id);
    if (ev === 'hit') {
      const kn = f ? MOB_KIND_OF[f.kind] : undefined;
      if (f && (kn === 'squid' || kn === 'glow_squid')) {
        // 오징어 먹물 (2026-11-07): 맞으면 먹물을 뿜는다. 발광 오징어는 청록 먹물에 5초 동안 빛이 꺼진다
        this.burst(f.cur.x, f.cur.y + 0.35, f.cur.z, kn === 'glow_squid' ? 0x2fe0c8 : 0x0d0d14, 26, now);
        if (kn === 'glow_squid') f.body.userData.dimUntil = now + 5000;
      }
      if (f) {
        f.flashUntil = now + 160;
        // 서버 자리로 바로 당긴다 (밀려난 게 보이게)
        f.target = { ...f.target, x, y, z };
        if (f.hp > 0 && dmg) {
          f.hp = Math.max(0, f.hp - dmg);
          f.shownHp = f.hp;
          drawHpBar(f.bar.ctx, f.bar.tex, f.hp, f.maxHp);
        }
      }
      if (dmg) this.pop(x, y + mobSize(f?.kind ?? 0).h + 0.7, z, dmg, now);
    } else if (ev === 'wake' && f) {
      f.flashUntil = now + 400;
    } else if (ev === 'love' || ev === 'tame' || ev === 'eat' || ev === 'grow' || ev === 'sit' || ev === 'free' || ev === 'follow' || ev === 'shear' || ev === 'egg' || ev === 'milk') {
      if (ev === 'eat') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '냠', '#ffffff', now);
      else if (ev === 'love') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '♥', '#ff5c8a', now);
      else if (ev === 'tame') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '♥♥', '#ff5c8a', now);
      else if (ev === 'grow') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '어른!', '#ffeb3b', now);
      else if (ev === 'shear') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '✂️', '#ffffff', now);
      else if (ev === 'egg') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '🥚', '#ffffff', now);
      else if (ev === 'milk') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '🥛', '#ffffff', now);
      else if (ev === 'free') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '자유!', '#ffeb3b', now);
      else if (ev === 'follow') this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '따라가요', '#ffffff', now);
    } else if (ev === 'gift') {
      this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '🎁', '#ffffff', now); // 고양이 선물 (2026-11-06)
    } else if (ev === 'wild') {
      this.popText(x, y + mobSize(f?.kind ?? 0).h + 0.5, z, '🌿 안녕!', '#9ccc65', now); // 야생으로 (2026-11-06)
    } else if (ev === 'hiss') {
      this.popText(x, y + 1.0, z, '하악!', '#ff8a65', now); // 크리퍼를 쫓는 고양이 (2026-11-06)
    } else if (ev === 'teleport' && f) {
      // 엔더맨 순간이동 (#222): 있던 자리와 새 자리에 보랏빛 가루, 인형은 바로 옮긴다
      this.burst(f.cur.x, f.cur.y + 1.2, f.cur.z, 0xb388ff, 14, now);
      this.burst(x, y + 1.2, z, 0xb388ff, 14, now);
      f.cur = { x, y, z, yaw: f.cur.yaw };
      f.target = { x, y, z, yaw: f.target.yaw };
      f.group.position.set(x, y, z);
    } else if (ev === 'stare' && f) {
      this.popText(x, y + mobSize(f.kind).h + 0.5, z, '👁', '#d36cff', now);
      f.flashUntil = now + 400;
    } else if (ev === 'heal' && f) {
      this.popText(x, y + mobSize(f.kind).h + 0.5, z, '+', '#7cff7c', now); // 엔더 드래곤 회복 (#224)
    } else if (ev === 'zombify') {
      // 주민이 좀비 주민이 됐다 (#244): 초록 가루. 인형은 다음 MobsState 에서 종류가 바뀌며 새로 만들어진다
      this.burst(x, y + 1.0, z, 0x5d8b4a, 18, now);
      this.popText(x, y + MOB_SIZE_H + 0.5, z, '🧟', '#9ccc65', now);
    } else if (ev === 'cure') {
      this.burst(x, y + 1.0, z, 0xffd54f, 14, now);
      this.popText(x, y + MOB_SIZE_H + 0.5, z, '🍎', '#ffd54f', now);
    } else if (ev === 'cured') {
      this.burst(x, y + 1.0, z, 0xffd54f, 24, now);
      this.popText(x, y + MOB_SIZE_H + 0.5, z, '🧑‍🌾', '#ffeb3b', now);
    } else if (ev === 'summon' && f) {
      f.summonT = 0.8;
      this.burst(x, y + 0.6, z, 0xb388ff, 16, now);
    } else if (ev === 'die' || ev === 'explode') {
      const color = ev === 'explode' ? 0xffd27a : !f ? 0xffffff : f.kind === 0 ? 0x5d8b4a : f.kind === 2 ? SPIDER_DARK : f.kind === 3 ? GOLD : f.kind >= 4 ? 0x9aa3a9 : CREEPER_GREEN;
      this.burst(x, y + mobSize(f?.kind ?? 0).h * 0.5, z, color, ev === 'explode' ? (id < 0 ? 56 : 28) : f?.kind === 3 ? 40 : 12, now); // TNT(id -1)는 더 크게 (#247)
      this.remove(id);
    }
  }

  /** 동물 부위 움직임: 다리는 대각선 짝으로, 머리는 걷는 박자·서 있으면 가끔 풀 뜯기, 강아지 꼬리는 길들이면 세워 흔들고, 닭은 걸을 때 날개 퍼덕 */
  private animateAnimal(f: Figure, moving: boolean, swing: number, now: number): void {
    const kindName = MOB_KIND_OF[f.kind] ?? 'cow';
    const t = now / 1000 + (f.id % 97) * 0.37; // 마리마다 박자가 다르게
    const sitting = (f.state & ANIMAL_FLAG.sitting) !== 0;
    const baby = (f.state & ANIMAL_FLAG.baby) !== 0;
    const tamed = (f.state & ANIMAL_FLAG.tamed) !== 0;
    f.legs.forEach((leg, i) => {
      let a = i === 0 || i === 3 ? swing : -swing;
      if (sitting && i >= 2) a = -1.35; // 앉으면 뒷다리를 앞으로 접는다
      leg.rotation.x = a;
    });
    if (f.head) {
      let nod = moving ? Math.sin(f.walk * 2) * 0.06 : 0;
      if (!moving && !sitting && kindName !== 'dog' && kindName !== 'cat') {
        const ph = t % 7; // 7초마다 1.8초 풀 뜯기
        if (ph < 1.8) nod -= (kindName === 'chicken' ? 0.5 : 0.75) * Math.sin((ph / 1.8) * Math.PI);
      }
      f.head.rotation.x = nod;
      f.head.scale.setScalar(baby ? f.babyHead : 1);
    }
    if (f.tail) {
      if (kindName === 'dog') {
        f.tail.rotation.x = sitting ? -0.35 : tamed ? -2.2 : -0.9; // 길들이면 꼬리를 세운다
        f.tail.rotation.z = tamed || moving ? Math.sin(t * 9) * 0.45 : 0;
      } else if (kindName === 'cat') {
        // 고양이 (2026-11-06): 걸을 땐 꼬리를 낮게 뒤로, 서 있으면 살랑, 앉으면 바닥에 내려놓는다
        f.tail.rotation.x = sitting ? 0.9 : moving ? 0.35 : -0.25 + Math.sin(t * 1.3) * 0.15;
        f.tail.rotation.y = sitting ? 0 : Math.sin(t * (moving ? 6 : 1.8)) * 0.3;
      } else {
        f.tail.rotation.x = 0.15;
        f.tail.rotation.z = Math.sin(t * 2.2) * 0.25; // 파리 쫓기
      }
    }
    f.wings.forEach((w, i) => {
      w.rotation.z = (i === 0 ? -1 : 1) * (moving ? Math.abs(Math.sin(f.walk * 3)) * 0.9 : 0);
    });
    f.body.position.y = sitting ? (kindName === 'cat' ? -0.08 : -0.14) : 0;
  }

  /** 사냥 동물 (2026-11-05): 다리는 대각선 짝, 덤빌 땐 머리를 숙여 들이받고 꼬리(방울뱀 방울)를 빠르게 떤다, 서 있으면 가끔 풀 뜯기 */
  private animateWild(f: Figure, moving: boolean, swing: number, now: number): void {
    const t = now / 1000 + (f.id % 97) * 0.37;
    const attack = f.state === MOB_STATE.attack;
    f.legs.forEach((leg, i) => {
      leg.rotation.x = i === 0 || i === 3 ? swing : -swing;
    });
    const kn = MOB_KIND_OF[f.kind];
    if (kn === 'shulker' && f.head) {
      f.head.rotation.x = attack ? 0.55 + 0.08 * Math.sin(now * 0.01) : 0; // 쏠 때 뚜껑을 연다 (닫으면 단단하다)
      return;
    }
    if (f.head) {
      const ph = t % 6;
      f.head.rotation.x = attack ? -0.5 * Math.max(0, Math.sin(now * 0.012)) : moving ? Math.sin(f.walk * 2) * 0.06 : ph < 1.5 ? -0.5 * Math.sin((ph / 1.5) * Math.PI) : 0;
    }
    if (f.wings.length === 2) {
      // 팬텀 (2026-11-07): 날개를 천천히 퍼덕인다 (내려꽂힐 땐 빠르게)
      const flap = Math.sin(t * (attack ? 7 : 2.4)) * 0.45;
      f.wings[0]!.rotation.z = -flap;
      f.wings[1]!.rotation.z = flap;
    }
    const puff = f.body.userData.puff as { big: THREE.Mesh; small: THREE.Mesh } | undefined;
    if (puff) {
      const on = attack;
      puff.big.visible = on;
      puff.small.visible = !on;
      if (f.head) f.head.visible = !on;
    }
    if (f.tail && MOB_KIND_OF[f.kind] === 'anaconda') f.tail.rotation.y = Math.sin(t * (moving ? 5 : 1.5)) * (moving ? 0.5 : 0.2); // 아나콘다는 꼬리를 좌우로 굽이친다
    else if (f.tail && MOB_KIND_OF[f.kind] === 'sperm_whale') f.tail.rotation.x = Math.sin(t * (moving ? 2.4 : 1.2)) * 0.16; // 고래는 꼬리를 위아래로 천천히
    else if (f.tail && FISH_MODEL_KINDS.has(MOB_KIND_OF[f.kind] ?? '')) f.tail.rotation.y = Math.sin(t * (moving ? 16 : 6)) * (moving ? 0.55 : 0.3); // 물고기는 꼬리를 좌우로
    else if (f.tail) f.tail.rotation.z = Math.sin(t * (attack ? 30 : moving ? 8 : 2.2)) * (attack ? 0.35 : 0.25);
    f.wings.forEach((w, i) => {
      w.rotation.z = (i === 0 ? -1 : 1) * (moving ? Math.abs(Math.sin(f.walk * 3)) * 0.6 : 0);
    });
  }

  /** 떠오르는 글자 (사랑 ♥·냠·어른!) */
  private popText(x: number, y: number, z: number, text: string, color: string, now: number): void {
    const c = canvasSprite(96, 48, 0.9, 0.45);
    c.ctx.font = 'bold 30px system-ui, sans-serif';
    c.ctx.textAlign = 'center';
    c.ctx.textBaseline = 'middle';
    c.ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    c.ctx.lineWidth = 6;
    c.ctx.fillStyle = color;
    c.ctx.strokeText(text, 48, 26);
    c.ctx.fillText(text, 48, 26);
    c.tex.needsUpdate = true;
    c.sprite.position.set(x, y, z);
    this.group.add(c.sprite);
    this.pops.push({ sprite: c.sprite, born: now });
  }

  /** 떠오르는 피해 숫자 "-N" */
  private pop(x: number, y: number, z: number, dmg: number, now: number): void {
    const c = canvasSprite(96, 48, 0.9, 0.45);
    c.ctx.font = 'bold 34px system-ui, sans-serif';
    c.ctx.textAlign = 'center';
    c.ctx.textBaseline = 'middle';
    c.ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    c.ctx.lineWidth = 6;
    c.ctx.fillStyle = '#ffeb3b';
    c.ctx.strokeText(`-${dmg}`, 48, 26);
    c.ctx.fillText(`-${dmg}`, 48, 26);
    c.tex.needsUpdate = true;
    c.sprite.position.set(x, y, z);
    this.group.add(c.sprite);
    this.pops.push({ sprite: c.sprite, born: now });
  }

  /** 주민이 삐졌다 (#220 놀리기): 머리 위로 빨간 김이 난다 */
  angryAt(id: number, now: number): void {
    const at = this.positionOf(id);
    if (!at) return;
    this.burst(at.x, at.y + mobSize(this.figures.get(id)?.kind ?? 0).h + 0.2, at.z, 0xff5252, 12, now);
  }

  private burst(x: number, y: number, z: number, color: number, n: number, now: number): void {
    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
    const parts: { m: THREE.Mesh; v: THREE.Vector3 }[] = [];
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(BURST_GEOM, mat);
      const a = (i / n) * Math.PI * 2,
        b = ((i * 7) % n) / n - 0.5;
      const v = new THREE.Vector3(Math.cos(a) * (2 + b), 2.5 + b * 2, Math.sin(a) * (2 + b));
      m.position.set(x, y, z);
      parts.push({ m, v });
      group.add(m);
    }
    this.group.add(group);
    this.bursts.push({ group, born: now, parts });
  }

  remove(id: number): void {
    const f = this.figures.get(id);
    if (!f) return;
    this.group.remove(f.group);
    f.material.dispose();
    f.bar.tex.dispose();
    f.bar.sprite.material.dispose();
    f.group.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    this.figures.delete(id);
  }

  clear(): void {
    for (const id of [...this.figures.keys()]) this.remove(id);
    for (const id of [...this.clouds.keys()]) this.cloudGone(id);
    for (const b of this.bursts) this.group.remove(b.group);
    this.bursts.length = 0;
    for (const p of this.pops) this.group.remove(p.sprite);
    this.pops.length = 0;
  }

  /** 조준선이 닿는 몹 (가장 가까운 것). 눈에서 maxDist 안 */
  /**
   * 조준하지 않아도 앞쪽 원뿔(시선과 각도 cos ≥ minCos) 안, reach 안에서 가장 가까운 몹 (#141 — 검을 들고 탭하면 휘두르기).
   * hostileOnly 면 동물(ANIMAL_ID_BASE 이상)은 뺀다 — 동물은 노려서 탭해야 먹이·길들이기와 안 헷갈린다
   */
  nearestInCone(eye: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, reach: number, minCos: number, hostileOnly: boolean): number | null {
    let best: number | null = null;
    let bestD = reach;
    for (const [id, f] of this.figures) {
      if (hostileOnly && id >= ANIMAL_ID_BASE) continue;
      const c = f.cur;
      const size = mobSize(f.kind);
      const dx = c.x - eye.x,
        dy = c.y + size.h * 0.5 - eye.y,
        dz = c.z - eye.z;
      const d = Math.hypot(dx, dy, dz);
      if (d <= 1e-6 || d - size.w * 0.5 > bestD) continue;
      const cos = (dx * dir.x + dy * dir.y + dz * dir.z) / d;
      if (cos < minCos) continue;
      bestD = Math.max(0, d - size.w * 0.5);
      best = id;
    }
    return best;
  }

  /** 인형 하나의 목표 자리를 직접 옮긴다 — 원정에 따라온 펫처럼 서버 목록에 없이 클라가 움직이는 것 (#145) */
  moveFigure(id: number, x: number, y: number, z: number, yaw: number): void {
    const f = this.figures.get(id);
    if (f) f.target = { x, y, z, yaw };
  }

  aim(eye: { x: number; y: number; z: number }, dir: { x: number; y: number; z: number }, maxDist: number): number | null {
    let best: number | null = null;
    let bestT = maxDist;
    for (const [id, f] of this.figures) {
      const c = f.cur;
      const size = mobSize(f.kind);
      const hw = size.w / 2;
      const min = [c.x - hw, c.y, c.z - hw],
        max = [c.x + hw, c.y + size.h, c.z + hw];
      const o = [eye.x, eye.y, eye.z],
        d = [dir.x, dir.y, dir.z];
      let t0 = 0,
        t1 = bestT;
      let ok = true;
      for (let i = 0; i < 3 && ok; i++) {
        if (Math.abs(d[i]!) < 1e-9) {
          if (o[i]! < min[i]! || o[i]! > max[i]!) ok = false;
          continue;
        }
        let a = (min[i]! - o[i]!) / d[i]!,
          b = (max[i]! - o[i]!) / d[i]!;
        if (a > b) [a, b] = [b, a];
        t0 = Math.max(t0, a);
        t1 = Math.min(t1, b);
        if (t0 > t1) ok = false;
      }
      if (ok && t0 < bestT) {
        bestT = t0;
        best = id;
      }
    }
    return best;
  }

  update(dt: number, now = performance.now()): void {
    const k = 1 - Math.exp(-dt * 12);
    for (const f of this.figures.values()) {
      const c = f.cur,
        t = f.target;
      const dx = t.x - c.x,
        dz = t.z - c.z;
      c.x += dx * k;
      c.y += (t.y - c.y) * k;
      c.z += dz * k;
      let dy = t.yaw - c.yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      c.yaw += dy * k;
      f.group.position.set(c.x, c.y, c.z);
      f.body.rotation.y = c.yaw;
      const speed = Math.hypot(dx, dz) * 12;
      if (speed > 0.3) f.walk += dt * Math.min(10, speed * 2);
      const swing = speed > 0.3 ? Math.sin(f.walk) * 0.5 : 0;
      if (f.legL && f.legR) {
        f.legL.rotation.x = swing;
        f.legR.rotation.x = -swing;
      }
      f.spiderLegs.forEach((leg, i) => {
        const base = leg.userData.baseY as number;
        leg.rotation.y = base + (i % 2 === 0 ? swing : -swing) * 0.5;
      });
      if (f.animal) this.animateAnimal(f, speed > 0.3, swing, now);
      else if (WILD_NAMES.has(MOB_KIND_OF[f.kind] ?? '')) this.animateWild(f, speed > 0.3, swing, now);
      else if (f.legs.length) {
        // 고릴라 (#253)·워든 (#254): 팔다리를 엇갈려 걷고, 덤빌 때는 두 팔을 번갈아 들어 내리친다
        const attack = f.state === MOB_STATE.attack;
        f.legs.forEach((leg, i) => {
          leg.rotation.x = attack && i < 2 ? 1.3 * Math.abs(Math.sin(now * 0.006 + i * 1.6)) : i === 0 || i === 3 ? swing : -swing;
        });
        if (f.head) f.head.rotation.x = speed > 0.3 ? Math.sin(f.walk * 2) * 0.05 : 0;
      }
      const stalkEyes = f.body.userData.stalkEyes as THREE.Mesh | undefined;
      if (stalkEyes) {
        // 호랑이 (2026-11-06): 나에게 4~14칸에서 다가오는 동안은 거의 투명, 붉은 눈만
        const d = this.viewer ? Math.hypot(this.viewer.x - c.x, this.viewer.z - c.z) : 99;
        const stalking = speed > 0.3 && d > 4 && d < 14;
        f.material.transparent = stalking;
        f.material.opacity = stalking ? 0.12 : 1;
        f.material.depthWrite = !stalking;
        stalkEyes.visible = stalking;
      }
      const spikes = f.body.userData.spikes as { long: THREE.Mesh; short: THREE.Mesh } | undefined;
      if (spikes) {
        const att = f.state === MOB_STATE.attack;
        spikes.long.visible = !att;
        spikes.short.visible = att;
      }
      const aura = f.body.userData.aura as THREE.MeshBasicMaterial | undefined;
      if (aura) aura.opacity = 0.18 + 0.14 * Math.abs(Math.sin(now * 0.011 + f.id)) + (Math.sin(now * 0.07 + f.id) > 0.93 ? 0.25 : 0); // 번개 기운이 일렁이고 가끔 번쩍
      if (f.body.userData.ender && now >= (f.body.userData.dustAt ?? 0)) {
        // 엔더맨 둘레 보라 가루 (아빠 그림)
        f.body.userData.dustAt = now + 380 + (f.id % 5) * 60;
        const big = MOB_KIND_OF[f.kind] === 'enderman_king' ? 2.5 : 1;
        const a = (now * 0.0013 + f.id) % (Math.PI * 2);
        this.burst(c.x + Math.cos(a) * 0.6 * big, c.y + (0.6 + ((now / 97) % 2)) * big, c.z + Math.sin(a) * 0.6 * big, 0xb85cf0, 2, now);
      }
      if (SLIME_KINDS.has(MOB_KIND_OF[f.kind] ?? '')) {
        // 슬라임 (2026-11-06): 걸을 땐 통통 튄다 — 몸을 들었다 놓고, 닿을 때 납작해진다
        const hop = speed > 0.3 ? Math.abs(Math.sin(f.walk * 1.2)) : 0;
        f.body.position.y = hop * 0.2 * ((f.body.userData.slimeScale as number | undefined) ?? f.scaleV.y);
        const k0 = (f.body.userData.slimeScale as number | undefined) ?? (f.body.userData.slimeScale = f.scaleV.x);
        const sq = (1 - hop) * 0.12 * (speed > 0.3 ? 1 : 0);
        f.scaleV.set(k0 * (1 + sq), k0 * (1 - sq), k0 * (1 + sq));
      }
      // 크리퍼 부풀기: 하얘지며 커진다
      if (f.state === MOB_STATE.fuse) {
        f.fuseT += dt;
        const s = 1 + 0.25 * Math.min(1, f.fuseT / 1.5) + 0.06 * Math.sin(f.fuseT * 30);
        f.body.scale.set(s, s, s);
        f.material.color.setRGB(1 + f.fuseT, 1 + f.fuseT, 1 + f.fuseT);
      } else {
        f.fuseT = 0;
        let s = 1;
        if (f.state === MOB_STATE.sleep) s *= 0.85; // 잠든 보스는 웅크린다
        if (f.animal || MOB_KIND_OF[f.kind] === 'villager') {
          if (f.state & ANIMAL_FLAG.baby) s *= 0.5; // 아기 (주민 아기도)
          if (f.state & ANIMAL_FLAG.love && now >= f.nextHeart) {
            f.nextHeart = now + 900;
            this.popText(c.x, c.y + mobSize(f.kind).h * s + 0.4, c.z, '♥', '#ff5c8a', now);
          }
        }
        if (f.summonT > 0) {
          f.summonT = Math.max(0, f.summonT - dt);
          s *= 1 + 0.12 * Math.sin((f.summonT / 0.8) * Math.PI); // 소환: 몸을 한 번 든다
        }
        f.body.scale.copy(f.scaleV).multiplyScalar(s);
        f.material.color.setRGB(1, 1, 1);
        if (MOB_KIND_OF[f.kind] === 'glow_squid') {
          // 발광 오징어: 늘 밝게 빛나고, 맞은 뒤 5초는 꺼진다
          const k = now < ((f.body.userData.dimUntil as number | undefined) ?? 0) ? 0.45 : 1.35;
          f.material.color.setRGB(k, k, k);
        }
        if (f.state === MOB_STATE.cure) {
          // 황금 사과를 먹은 좀비 주민 (#244): 부르르 떨며 1초마다 ✨
          f.body.position.x = Math.sin(now * 0.05) * 0.04;
          if (now >= f.nextHeart) {
            f.nextHeart = now + 1000;
            this.popText(c.x, c.y + MOB_SIZE_H + 0.3, c.z, '✨', '#ffd54f', now);
          }
        } else if (f.body.position.x !== 0) f.body.position.x = 0;
      }
      if (now < f.flashUntil) f.material.color.setRGB(2.2, 0.6, 0.6);
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]!;
      const age = (now - b.born) / 1000;
      if (age > 0.9) {
        this.group.remove(b.group);
        this.bursts.splice(i, 1);
        continue;
      }
      for (const p of b.parts) {
        p.m.position.addScaledVector(p.v, dt);
        p.v.y -= 9.8 * dt;
      }
      (b.parts[0]!.m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - age / 0.9);
    }
    for (const [id, c] of this.clouds) {
      if (c.at < 0) {
        c.at = now;
        c.until = now + c.leftMs;
      }
      if (now >= c.until) {
        this.cloudGone(id);
        continue;
      }
      const r = Math.max(0.2, c.radius - (now - c.at) / 30_000);
      const n = c.parts.length;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + now * 0.0004 * (i % 2 ? 1 : -1) + c.seed;
        const rr = r * (0.25 + 0.75 * (((i * 13) % n) / n));
        c.parts[i]!.position.set(c.x + Math.cos(a) * rr, c.y + 0.12 + 0.4 * (0.5 + 0.5 * Math.sin(now * 0.002 + i)), c.z + Math.sin(a) * rr);
      }
    }
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const s = this.shots[i]!;
      if (s.born < 0) s.born = now;
      const k = (now - s.born) / s.ms;
      if (k >= 1) {
        this.group.remove(s.mesh);
        this.shots.splice(i, 1);
        if (s.fire) {
          // 불덩이 터짐 (#215, 아들 14차 7번 "불덩이(터짐)로 바꿀까?"): 닿는 자리에서 불꽃 + 연기가 흩어진다
          this.burst(s.to.x, s.to.y, s.to.z, 0xff8a2a, 18, now);
          this.burst(s.to.x, s.to.y, s.to.z, 0x4a4a4a, 8, now);
          this.onFireHit?.();
        }
        if (s.beam) {
          s.mesh.geometry.dispose();
          (s.mesh.material as THREE.Material).dispose();
        }
        if (s.splash !== undefined) {
          (s.mesh.material as THREE.Material).dispose();
          this.burst(s.to.x, s.to.y, s.to.z, s.splash, 16, now); // 물약이 깨져 퍼진다 (#245)
        }
        continue;
      }
      if (s.beam) {
        (s.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - k); // 빛줄기는 제자리에서 흐려진다
        continue;
      }
      s.mesh.position.lerpVectors(s.from, s.to, k);
      if (s.fire) {
        // 날아가며 불꽃처럼 일렁인다
        const w = 1 + 0.2 * Math.sin(now * 0.04);
        s.mesh.scale.set(w, w, w);
      }
    }
    for (let i = this.pops.length - 1; i >= 0; i--) {
      const p = this.pops[i]!;
      const age = (now - p.born) / 1000;
      if (age > 0.8) {
        this.group.remove(p.sprite);
        (p.sprite.material as THREE.SpriteMaterial).map?.dispose();
        p.sprite.material.dispose();
        this.pops.splice(i, 1);
        continue;
      }
      p.sprite.position.y += dt * 0.9;
      (p.sprite.material as THREE.SpriteMaterial).opacity = age < 0.5 ? 1 : 1 - (age - 0.5) / 0.3;
    }
  }
}
