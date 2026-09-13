#!/usr/bin/env node
/**
 * 임시 16×16 텍스처 생성기. 실행: pnpm textures
 * - textures/ 에 이미 있는 파일은 건너뛴다 (아들이 그린 그림을 덮어쓰지 않기 위해). 전부 다시 만들려면 --force
 * - 외부 의존성 없음 (PNG 인코더 내장). 시드 기반이라 같은 이름은 항상 같은 그림.
 */
import { deflateSync } from 'node:zlib';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'textures');
const FORCE = process.argv.includes('--force');
const S = 16;

// ---------- PNG ----------
const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- PRNG ----------
function hashString(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- 그리기 도우미 ----------
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
class Canvas {
  constructor(name) {
    this.px = Buffer.alloc(S * S * 4);
    this.rnd = mulberry32(hashString(name));
  }
  set(x, y, r, g, b, a = 255) {
    const i = (y * S + x) * 4;
    this.px[i] = clamp(r);
    this.px[i + 1] = clamp(g);
    this.px[i + 2] = clamp(b);
    this.px[i + 3] = clamp(a);
  }
  get(x, y) {
    const i = (y * S + x) * 4;
    return [this.px[i], this.px[i + 1], this.px[i + 2], this.px[i + 3]];
  }
  /** 기본색 + 픽셀 노이즈 */
  noise([r, g, b], amp, a = 255) {
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const n = (this.rnd() - 0.5) * 2 * amp;
        this.set(x, y, r + n, g + n, b + n, a);
      }
    return this;
  }
  /** 픽셀에 밝기 곱 */
  mul(x, y, k) {
    const [r, g, b, a] = this.get(x, y);
    this.set(x, y, r * k, g * k, b * k, a);
  }
  /** 저주파 얼룩: 4×4 셀마다 밝기 배율 */
  blotch(amount) {
    const cells = [];
    for (let i = 0; i < 16; i++) cells.push(1 + (this.rnd() - 0.5) * 2 * amount);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) this.mul(x, y, cells[(y >> 2) * 4 + (x >> 2)]);
    return this;
  }
  /** 셀(돌멩이) 패턴 — 가까운 중심점 기준, 경계는 어둡게 */
  cells(count, base, varAmt, edgeDark, noiseAmp = 8) {
    const pts = [];
    for (let i = 0; i < count; i++) pts.push([this.rnd() * S, this.rnd() * S, 1 + (this.rnd() - 0.5) * 2 * varAmt]);
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        let d1 = 1e9,
          d2 = 1e9,
          k = 1;
        for (const [px, py, shade] of pts) {
          // 타일링을 위해 래핑 거리
          let dx = Math.abs(x + 0.5 - px),
            dy = Math.abs(y + 0.5 - py);
          dx = Math.min(dx, S - dx);
          dy = Math.min(dy, S - dy);
          const d = dx * dx + dy * dy;
          if (d < d1) {
            d2 = d1;
            d1 = d;
            k = shade;
          } else if (d < d2) d2 = d;
        }
        const edge = Math.sqrt(d2) - Math.sqrt(d1) < 0.9 ? edgeDark : 1;
        const n = (this.rnd() - 0.5) * 2 * noiseAmp;
        this.set(x, y, base[0] * k * edge + n, base[1] * k * edge + n, base[2] * k * edge + n);
      }
    return this;
  }
  /** 광석 알갱이: 작은 덩어리 몇 개 */
  ore(color, clusters = 4) {
    for (let c = 0; c < clusters; c++) {
      const cx = Math.floor(this.rnd() * S),
        cy = Math.floor(this.rnd() * S);
      const shape = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 0],
        [0, 2],
        [-1, 1],
        [1, -1],
      ];
      const n = 3 + Math.floor(this.rnd() * 4);
      for (let i = 0; i < n; i++) {
        const [dx, dy] = shape[i];
        const x = (cx + dx + S) % S,
          y = (cy + dy + S) % S;
        const k = 0.85 + this.rnd() * 0.3;
        this.set(x, y, color[0] * k, color[1] * k, color[2] * k);
      }
    }
    return this;
  }
  frame(color, a = 255) {
    for (let i = 0; i < S; i++) {
      this.set(i, 0, ...color, a);
      this.set(i, S - 1, ...color, a);
      this.set(0, i, ...color, a);
      this.set(S - 1, i, ...color, a);
    }
    return this;
  }
}

// ---------- 텍스처 정의 ----------
const STONE = [125, 125, 125];
const DIRT = [134, 96, 67];
const GRASS = [91, 153, 55];
const BARK = [102, 81, 50];
const WOOD = [162, 130, 78];

const TEX = {
  missing: (c) => {
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) ((x >> 3) + (y >> 3)) & 1 ? c.set(x, y, 0, 0, 0) : c.set(x, y, 248, 0, 248);
  },
  stone: (c) => c.noise(STONE, 10).blotch(0.08),
  cobblestone: (c) => c.cells(9, [118, 118, 118], 0.12, 0.62),
  dirt: (c) => {
    c.noise(DIRT, 14);
    for (let i = 0; i < 12; i++) c.mul(Math.floor(c.rnd() * S), Math.floor(c.rnd() * S), 0.75);
  },
  grass_top: (c) => c.noise(GRASS, 12),
  grass_side: (c) => {
    c.noise(DIRT, 14);
    for (let x = 0; x < S; x++) {
      const depth = 2 + Math.floor(c.rnd() * 3); // 2~4줄
      for (let y = 0; y < depth; y++) {
        const n = (c.rnd() - 0.5) * 24;
        c.set(x, y, GRASS[0] + n, GRASS[1] + n, GRASS[2] + n);
      }
      c.mul(x, depth, 0.8); // 잔디 아래 그늘
    }
  },
  sand: (c) => c.noise([219, 207, 163], 8).blotch(0.04),
  gravel: (c) => c.cells(16, [128, 122, 118], 0.2, 0.7, 10),
  log_side: (c) => {
    for (let x = 0; x < S; x++) {
      const col = 1 + (c.rnd() - 0.5) * 0.3;
      for (let y = 0; y < S; y++) {
        const n = (c.rnd() - 0.5) * 12;
        c.set(x, y, BARK[0] * col + n, BARK[1] * col + n, BARK[2] * col + n);
      }
    }
    for (let i = 0; i < 3; i++) {
      const x = Math.floor(c.rnd() * S);
      for (let y = 0; y < S; y++) if (c.rnd() < 0.8) c.mul(x, y, 0.7);
    }
  },
  log_top: (c) => {
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const d = Math.hypot(x - 7.5, y - 7.5);
        const n = (c.rnd() - 0.5) * 10;
        if (d > 6.6) c.set(x, y, BARK[0] + n, BARK[1] + n, BARK[2] + n);
        else {
          const ring = Math.floor(d) % 3 === 0 ? 0.82 : 1;
          c.set(x, y, 188 * ring + n, 152 * ring + n, 98 * ring + n);
        }
      }
  },
  planks: (c) => {
    for (let board = 0; board < 4; board++) {
      const k = 1 + (c.rnd() - 0.5) * 0.14;
      const seamX = Math.floor(c.rnd() * S);
      for (let y = board * 4; y < board * 4 + 4; y++)
        for (let x = 0; x < S; x++) {
          const n = (c.rnd() - 0.5) * 12;
          let m = k;
          if (y === board * 4 + 3) m *= 0.68; // 판자 사이 틈
          if (x === seamX && y !== board * 4 + 3) m *= 0.75;
          c.set(x, y, WOOD[0] * m + n, WOOD[1] * m + n, WOOD[2] * m + n);
        }
    }
  },
  leaves: (c) => {
    c.noise([58, 132, 42], 26);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (c.rnd() < 0.22) c.set(x, y, 0, 0, 0, 0);
  },
  glass: (c) => {
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) c.set(x, y, 255, 255, 255, 0);
    c.frame([225, 240, 245], 230);
    for (let i = 0; i < S; i++) {
      // 대각선 하이라이트 두 줄
      const x1 = i,
        y1 = S - 1 - i;
      if (x1 > 1 && x1 < 7 && y1 > 1 && y1 < 14) c.set(x1, y1, 240, 250, 255, 200);
      const x2 = i + 5,
        y2 = S - 1 - i;
      if (x2 > 1 && x2 < 14 && y2 > 1 && y2 < 14) c.set(x2, y2, 240, 250, 255, 200);
    }
  },
  water: (c) => c.noise([52, 96, 220], 16, 168).blotch(0.06),
  bedrock: (c) => c.noise([84, 84, 84], 34).blotch(0.15),
  coal_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([28, 28, 28]),
  iron_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([214, 172, 148]),
  gold_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([250, 232, 80]),
  diamond_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([96, 232, 226]),
  emerald_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([28, 212, 96], 3),
  lapis_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([40, 98, 170]),
  redstone_ore: (c) => c.noise(STONE, 10).blotch(0.08).ore([214, 18, 18]),
  quartz_ore: (c) => c.noise([110, 52, 52], 18).ore([236, 228, 220]),
  netherrack: (c) => c.noise([110, 52, 52], 18).blotch(0.1),
  end_stone: (c) => c.cells(10, [221, 223, 165], 0.06, 0.88, 6),
  obsidian: (c) => c.noise([22, 18, 34], 10).blotch(0.2),
  snow: (c) => c.noise([240, 246, 246], 6),
  ice: (c) => c.noise([146, 184, 250], 10, 220).blotch(0.05),
  glowstone: (c) => c.noise([150, 116, 70], 14).ore([252, 226, 120], 6).ore([255, 240, 170], 4),
  bookshelf: (c) => {
    TEX.planks(c);
    for (const row of [2, 8]) {
      let x = 1;
      while (x < S - 1) {
        const w = 1 + Math.floor(c.rnd() * 2);
        const col = [
          [170, 40, 40],
          [40, 90, 170],
          [60, 140, 60],
          [200, 170, 60],
          [120, 70, 150],
          [230, 230, 230],
        ][Math.floor(c.rnd() * 6)];
        const h = 5 + Math.floor(c.rnd() * 2);
        for (let dx = 0; dx < w && x + dx < S - 1; dx++) for (let y = row + (6 - h); y < row + 6; y++) c.set(x + dx, y, ...col);
        x += w;
        if (c.rnd() < 0.15) x++;
      }
    }
  },
  hay_bale: (c) => {
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const stripe = y % 4 === 3 ? 0.7 : 1;
        const n = (c.rnd() - 0.5) * 20;
        c.set(x, y, 196 * stripe + n, 164 * stripe + n, 62 * stripe + n);
      }
  },
  wool: (c) => c.noise([232, 232, 232], 8).blotch(0.03),
  iron_block: (c) => c.noise([222, 222, 222], 4).frame([190, 190, 190]),
  gold_block: (c) => c.noise([250, 226, 80], 6).frame([210, 180, 50]),
  diamond_block: (c) => c.noise([110, 232, 224], 6).frame([80, 190, 190]),
  emerald_block: (c) => c.noise([60, 200, 100], 6).frame([40, 150, 70]),
  quartz_block: (c) => c.noise([236, 232, 226], 4),
  netherite_block: (c) => c.noise([66, 60, 62], 6).frame([50, 44, 46]),
  soul_sand: (c) => c.noise([82, 62, 50], 12).ore([40, 28, 24], 5),
  cactus: (c) => c.noise([66, 130, 48], 10).frame([40, 90, 30]),
  pumpkin: (c) => {
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const stripe = x % 5 === 0 ? 0.78 : 1;
        const n = (c.rnd() - 0.5) * 14;
        c.set(x, y, 226 * stripe + n, 128 * stripe + n, 32 * stripe + n);
      }
  },
  melon: (c) => {
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const stripe = (x + Math.floor(c.rnd() * 2)) % 4 === 0 ? 0.6 : 1;
        c.set(x, y, 90 * stripe, 150 * stripe, 50 * stripe);
      }
  },
  furnace: (c) => {
    c.cells(9, [118, 118, 118], 0.12, 0.62);
    for (let y = 8; y < 13; y++) for (let x = 4; x < 12; x++) c.set(x, y, 20, 20, 20);
    for (let y = 10; y < 13; y++) for (let x = 5; x < 11; x++) if (c.rnd() < 0.6) c.set(x, y, 240, 140 + c.rnd() * 60, 30);
  },
  lava: (c) => c.noise([214, 90, 20], 22).blotch(0.12).ore([255, 210, 60], 5),
  dried_ghast: (c) => {
    c.noise([206, 202, 196], 8).blotch(0.06);
    // 감은 눈 두 개와 입
    for (const x of [4, 5, 10, 11]) c.set(x, 6, 70, 66, 70);
    for (let x = 6; x <= 9; x++) c.set(x, 11, 70, 66, 70);
  },
};

mkdirSync(OUT, { recursive: true });
let made = 0,
  skipped = 0;
for (const [name, draw] of Object.entries(TEX)) {
  const file = join(OUT, `${name}.png`);
  if (existsSync(file) && !FORCE) {
    skipped++;
    continue;
  }
  const c = new Canvas(name);
  draw(c);
  writeFileSync(file, encodePNG(S, S, c.px));
  made++;
}
console.log(`textures/: ${made}개 생성, ${skipped}개 건너뜀 (이미 있음)${FORCE ? ' [--force]' : ''}`);
