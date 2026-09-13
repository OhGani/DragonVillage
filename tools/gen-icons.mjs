#!/usr/bin/env node
/**
 * 홈 화면 아이콘 생성 (등각 잔디 블록). 실행: node tools/gen-icons.mjs
 * 출력: packages/client/public/icon-192.png, icon-512.png (덮어씀). 외부 의존성 없음.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'packages', 'client', 'public');

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
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

// 16×16 텍셀 색 (시드 고정)
const rnd = mulberry32(0x1c0e);
const grassTop = [],
  side = [];
for (let i = 0; i < 256; i++) {
  const n = (rnd() - 0.5) * 24;
  grassTop.push([91 + n, 153 + n, 55 + n]);
}
for (let v = 0; v < 16; v++)
  for (let u = 0; u < 16; u++) {
    const n = (rnd() - 0.5) * 28;
    const grassDepth = 2 + Math.floor(rnd() * 3);
    side.push(v < grassDepth ? [91 + n, 153 + n, 55 + n] : v === grassDepth ? [134 * 0.8 + n, 96 * 0.8 + n, 67 * 0.8 + n] : [134 + n, 96 + n, 67 + n]);
  }

function render(S) {
  const k = S / 32; // 텍셀 1개 = k 픽셀
  const px = Buffer.alloc(S * S * 4);
  const put = (x, y, rgb, shade) => {
    const i = (y * S + x) * 4;
    px[i] = Math.max(0, Math.min(255, Math.round(rgb[0] * shade)));
    px[i + 1] = Math.max(0, Math.min(255, Math.round(rgb[1] * shade)));
    px[i + 2] = Math.max(0, Math.min(255, Math.round(rgb[2] * shade)));
    px[i + 3] = 255;
  };
  // 여백 8%: 블록을 84% 크기로 가운데에
  const pad = S * 0.08,
    kk = k * 0.84;
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const X = x - pad,
        Y = y - pad;
      // 윗면: x = 16kk + kk(u - v), y = 0.5kk(u + v)
      let u = (X - 16 * kk + 2 * Y) / (2 * kk),
        v = (2 * Y - (X - 16 * kk)) / (2 * kk);
      if (u >= 0 && u < 16 && v >= 0 && v < 16) {
        put(x, y, grassTop[Math.floor(v) * 16 + Math.floor(u)], 1.0);
        continue;
      }
      // 왼쪽 면: x = kk·u, y = 8kk + 0.5kk·u + kk·v
      u = X / kk;
      v = (Y - 8 * kk - 0.5 * kk * u) / kk;
      if (u >= 0 && u < 16 && v >= 0 && v < 16) {
        put(x, y, side[Math.floor(v) * 16 + Math.floor(u)], 0.78);
        continue;
      }
      // 오른쪽 면: x = 16kk + kk·u, y = 16kk - 0.5kk·u + kk·v
      u = (X - 16 * kk) / kk;
      v = (Y - 16 * kk + 0.5 * kk * u) / kk;
      if (u >= 0 && u < 16 && v >= 0 && v < 16) put(x, y, side[Math.floor(v) * 16 + Math.floor(u)], 0.58);
    }
  return encodePNG(S, S, px);
}

mkdirSync(OUT, { recursive: true });
for (const S of [192, 512]) writeFileSync(join(OUT, `icon-${S}.png`), render(S));
console.log('icon-192.png, icon-512.png 생성 →', OUT);
