// 드래곤 복셀 모델 생성기 — 아들의 스케치(2026-09-12)를 바탕으로 한 3종 × 2단계(아기·어른).
// 아기: 작고 둥글게. 어른: 약 2배 크기, 긴 뿔·척추 가시·이빨 줄·큰 날개·긴 꼬리·빛나는 눈.
// 브라우저(three.js 렌더)와 Node(JSON 내보내기) 양쪽에서 동작. 의존성 없음.
// 좌표: x = 좌우(+가 오른쪽), y = 위(0이 발바닥), z = 앞뒤(+가 머리 방향).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DragonVoxels = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  // 결정론적 노이즈 (Math.random 금지 규칙)
  function hash(x, y, z, seed) {
    let h = (x * 374761393 + y * 668265263 + z * 2147483647 + seed * 97) | 0;
    h = (h ^ (h >>> 13)) * 1274126177; h = h ^ (h >>> 16);
    return ((h >>> 0) % 1000) / 1000;
  }

  class Grid {
    constructor() { this.map = new Map(); }
    key(x, y, z) { return x + ',' + y + ',' + z; }
    set(x, y, z, c) { if (y < 0) return; this.map.set(this.key(x, y, z), { x, y, z, c }); }
    get(x, y, z) { return this.map.get(this.key(x, y, z)); }
    box(x0, y0, z0, x1, y1, z1, c) {
      for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
        for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++)
          for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++) this.set(x, y, z, c);
    }
    mirror() { // x 대칭 복제 (x<0 쪽을 x>0으로)
      for (const v of Array.from(this.map.values())) if (v.x < 0) this.set(-v.x, v.y, v.z, v.c);
    }
    list() { return Array.from(this.map.values()); }
  }

  // 공통 골격 — 아기 단계. p = 드래곤별 파라미터
  function buildBaby(p) {
    const g = new Grid();
    const C = p.colors;
    const S = p.seed;

    // ---- 몸통 (배는 밝게, 등은 무늬)
    for (let z = -5; z <= 5; z++) {
      const w = Math.abs(z) >= 5 ? 1 : 2;           // 앞뒤 끝은 좁게
      const yTop = 7 + (Math.abs(z) >= 4 ? -1 : 0);
      for (let x = -w; x <= w; x++) for (let y = 4; y <= yTop; y++) {
        let c = C.body;
        if (y === 4) c = C.belly;
        else if (y === yTop && hash(x, y, z, S) < p.scaleNoise) c = C.dark;
        g.set(x, y, z, c);
      }
    }
    // 등 갈기/척추
    for (let z = -5; z <= 4; z += 2) g.set(0, 8, z, p.spineStyle === 'blade' ? C.accent : C.dark);
    if (p.spineStyle === 'blade') for (let z = -4; z <= 3; z += 2) g.set(0, 9, z, C.accent);

    // ---- 목 (앞으로 올라감)
    const neck = [[6, 6], [7, 7], [8, 8], [8, 9]];
    for (const [z, y] of neck) { g.box(-1, y, z, 1, y + 1, z, C.body); g.set(0, y, z, C.belly); }

    // ---- 머리
    const hz = 9, hy = 9;
    g.box(-1, hy, hz, 1, hy + 2, hz + 3, C.body);          // 두개골
    g.box(-1, hy, hz + 4, 1, hy + 1, hz + 5, C.body);      // 주둥이
    g.box(-1, hy, hz + 4, 1, hy, hz + 5, C.belly);         // 아래턱
    g.set(-1, hy + 2, hz + 2, C.eye); g.set(1, hy + 2, hz + 2, C.eye);         // 눈
    g.set(-1, hy + 2, hz + 3, C.eyeDark); g.set(1, hy + 2, hz + 3, C.eyeDark); // 눈동자
    g.set(-1, hy, hz + 5, C.dark); g.set(1, hy, hz + 5, C.dark);               // 코
    // 이빨
    g.set(-1, hy - 1, hz + 5, C.tooth); g.set(1, hy - 1, hz + 5, C.tooth);

    // ---- 뿔 (드래곤별)
    if (p.horn === 'spiky') {          // 나무: 가지처럼 갈라진 뿔
      g.box(-1, hy + 3, hz, -1, hy + 4, hz, C.accent); g.set(-2, hy + 5, hz - 1, C.accent); g.set(-1, hy + 5, hz + 1, C.accent);
      g.set(0, hy + 3, hz + 1, C.accent); g.set(0, hy + 4, hz + 1, C.accent);
    } else if (p.horn === 'ears') {    // 대지: 넓적한 큰 귀 + 돌 뿔
      g.box(-2, hy + 2, hz, -2, hy + 4, hz + 1, C.dark); g.set(-2, hy + 5, hz + 1, C.dark);
      g.set(0, hy + 3, hz + 2, C.accent);
    } else if (p.horn === 'blade') {   // 철: 뒤로 뻗은 날 하나 + 관자놀이 날
      g.set(0, hy + 3, hz, C.accent); g.set(0, hy + 4, hz - 1, C.accent); g.set(0, hy + 5, hz - 2, C.accent); g.set(0, hy + 6, hz - 3, C.accent);
      g.set(-2, hy + 2, hz + 1, C.accent); g.set(-2, hy + 3, hz, C.accent);
    }

    // ---- 다리 (앞 2, 뒤 2) + 발톱
    for (const [zx, zz] of [[-2, 3], [-2, -4]]) {
      g.box(zx, 1, zz, zx, 4, zz + 1, C.body);
      g.box(zx, 0, zz - 1, zx, 0, zz + 1, C.dark);         // 발
      g.set(zx, 0, zz + 2, C.tooth);                       // 발톱
      if (p.bulky) g.box(zx - 1, 3, zz, zx - 1, 4, zz + 1, C.body); // 대지: 두꺼운 허벅지
    }

    // ---- 꼬리 (뒤로, 살짝 위로)
    const tail = [[-6, 5], [-7, 5], [-8, 5], [-9, 6], [-10, 6], [-11, 7], [-12, 8]];
    tail.forEach(([z, y], i) => {
      const thick = i < 3 ? 1 : 0;
      g.box(-thick, y, z, thick, y + (i < 4 ? 1 : 0), z, C.body);
      if (i % 2 === 0 && i < 5) g.set(0, y + 2, z, C.dark);
    });
    // 꼬리 끝 (드래곤별)
    if (p.tailTip === 'leaf') { g.box(-1, 8, -13, 1, 9, -13, C.wing); g.set(0, 10, -13, C.wing); g.set(0, 8, -14, C.wing); }
    else if (p.tailTip === 'club') { g.box(-1, 7, -13, 1, 9, -14, C.dark); }
    else if (p.tailTip === 'blade') { g.set(0, 9, -13, C.accent); g.set(0, 10, -13, C.accent); g.set(0, 8, -14, C.accent); g.set(0, 9, -14, C.accent); }

    // ---- 날개 (왼쪽만 그리고 mirror) — 어깨에서 바깥·위로 뻗는 한 장의 막 + 앞가장자리 뼈
    const sx = -2, sy = 7, sz = 1; // 어깨
    function wingPlane(W, rise, sweep, tipStyle) {
      for (let i = 1; i <= W; i++) {
        const y = sy + Math.round(i * rise);
        const zBack = sz - Math.round(i * sweep), zFront = sz + 1 - (i > W - 2 ? 1 : 0);
        for (let z = zBack; z <= zFront; z++) {
          let c = C.wing;
          if (z === zFront) c = C.dark;                                  // 앞가장자리 뼈
          else if ((z - zBack) % 3 === 0 && i > 1) c = C.wingVein;      // 잎맥/판 이음새
          g.set(sx - i, y, z, c);
        }
        if (i === 1) g.set(sx - i, y - 1, sz, C.dark);                  // 어깨 관절
      }
      const tipX = sx - W - 1, tipY = sy + Math.round(W * rise);
      if (tipStyle === 'claw') { g.set(tipX, tipY, sz + 1, C.tooth); g.set(tipX, tipY + 1, sz + 1, C.dark); }
      if (tipStyle === 'spike') { g.set(tipX, tipY + 1, sz, C.accent); g.set(tipX - 1, tipY + 2, sz, C.accent); }
    }
    if (p.wing === 'leaf')  wingPlane(8, 0.7, 0.9, 'claw');    // 나무: 크고 뒤로 넓게 퍼지는 잎 날개
    if (p.wing === 'stub')  wingPlane(4, 0.5, 0.6, 'claw');    // 대지: 작고 두꺼운 날개
    if (p.wing === 'plate') wingPlane(6, 0.8, 0.7, 'spike');   // 철: 길고 각진 금속판 날개

    g.mirror();
    return g.list();
  }


  // 색을 어둡게/밝게
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.round(((n >> 16) & 255) * f)), g = Math.min(255, Math.round(((n >> 8) & 255) * f)), b = Math.min(255, Math.round((n & 255) * f));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  // 어른 단계 — 약 2배 크기, 더 무섭게: 긴 뿔, 척추 가시, 이빨 줄, 큰 날개, 긴 꼬리, 빛나는 눈
  function buildAdult(p) {
    const g = new Grid();
    const C = Object.assign({}, p.colors, { body: shade(p.colors.body, 0.88), dark: shade(p.colors.dark, 0.85), eye: p.colors.eye, glow: shade(p.colors.eye, 1.15) });
    const S = p.seed + 7;

    // ---- 몸통 (z -8..8, x -3..3, y 5..11) — 가슴은 더 두껍게
    for (let z = -8; z <= 8; z++) {
      const w = Math.abs(z) >= 8 ? 1 : (Math.abs(z) >= 6 ? 2 : 3);
      const yTop = 11 - (Math.abs(z) >= 6 ? 1 : 0) - (Math.abs(z) >= 8 ? 1 : 0);
      for (let x = -w; x <= w; x++) for (let y = 5; y <= yTop; y++) {
        let c = C.body;
        if (y <= 6 && Math.abs(x) <= 1) c = C.belly;                                  // 배 판
        else if (y === yTop && hash(x, y, z, S) < p.scaleNoise + 0.15) c = C.dark;   // 등 비늘
        if (p.armor && y >= 9 && Math.abs(x) === w && (z + 8) % 3 === 0) c = C.dark; // 대지: 옆구리 돌 갑판
        if (p.plates && y === yTop && (z + 8) % 2 === 0) c = C.accent;               // 철: 등 금속판
        g.set(x, y, z, c);
      }
    }
    // 척추 가시 — 두 줄, 높이 교대
    for (let z = -8; z <= 6; z++) {
      const h = (z + 8) % 2 === 0 ? 2 : 1;
      for (let k = 1; k <= h; k++) g.set(0, 11 + k, z, p.spineStyle === 'blade' ? C.accent : C.dark);
    }
    // 어깨 갑주
    g.box(-4, 9, 1, -4, 10, 3, C.dark); g.box(-4, 11, 2, -4, 11, 2, C.accent);

    // ---- 목 — 더 굵고 높이 솟음
    const neck = [[9, 8], [10, 9], [11, 10], [12, 11], [13, 12]];
    for (const [z, y] of neck) { g.box(-2, y, z, 2, y + 2, z, C.body); g.box(-1, y, z, 1, y, z, C.belly); g.set(0, y + 3, z, C.dark); }

    // ---- 머리 (크고 납작한 악어 두개골)
    const hz = 14, hy = 12;
    g.box(-2, hy, hz, 2, hy + 3, hz + 4, C.body);            // 두개골
    g.box(-2, hy + 4, hz + 1, 2, hy + 4, hz + 3, C.dark);    // 눈썹 뼈
    g.box(-2, hy, hz + 5, 2, hy + 2, hz + 8, C.body);        // 주둥이
    g.box(-2, hy - 1, hz + 5, 2, hy - 1, hz + 8, C.belly);   // 아래턱
    // 눈 — 빛나는 두 칸
    for (const x of [-2, 2]) { g.set(x, hy + 3, hz + 3, C.glow); g.set(x, hy + 3, hz + 4, C.eyeDark); g.set(x, hy + 2, hz + 3, C.eye); }
    // 코
    g.set(-2, hy + 2, hz + 8, C.dark); g.set(2, hy + 2, hz + 8, C.dark);
    // 이빨 줄 (위·아래, 어긋나게)
    for (let z = hz + 5; z <= hz + 8; z++) { const x = (z % 2 === 0) ? -2 : 2; g.set(x, hy - 2, z, C.tooth); g.set(-x, hy - 1, z, C.tooth); }
    g.set(-2, hy - 2, hz + 8, C.tooth); g.set(2, hy - 2, hz + 8, C.tooth);
    // 턱 아래 가시
    g.set(0, hy - 3, hz + 8, C.dark);

    // ---- 뿔 (어른: 길고 뒤로 휘어짐)
    if (p.horn === 'spiky') {          // 나무: 가지 뿔 두 개, 끝에 잎
      for (const x of [-2, 2]) {
        [[0, 0], [1, -1], [2, -2], [3, -3], [4, -4]].forEach(([dy, dz], i) => g.set(x + (x < 0 ? -Math.floor(i / 2) : Math.floor(i / 2)), hy + 4 + dy, hz + dz, C.accent));
        g.set(x + (x < 0 ? -2 : 2), hy + 9, hz - 4, C.wing); g.set(x + (x < 0 ? -1 : 1), hy + 7, hz - 1, C.wing);
      }
    } else if (p.horn === 'ears') {    // 대지: 넓은 판 귀 + 두꺼운 돌 뿔
      for (const x of [-3, 3]) { g.box(x, hy + 2, hz - 1, x, hy + 6, hz + 2, C.dark); g.set(x, hy + 7, hz + 1, C.dark); }
      g.box(-1, hy + 4, hz + 3, 1, hy + 6, hz + 3, C.accent); g.set(0, hy + 7, hz + 3, C.accent);
    } else if (p.horn === 'blade') {   // 철: 뒤로 길게 뻗은 이중 날
      for (const x of [-1, 1]) [[0, 0], [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [5, -6]].forEach(([dy, dz]) => g.set(x, hy + 4 + dy, hz + dz, C.accent));
      for (const x of [-3, 3]) { g.set(x, hy + 3, hz + 1, C.accent); g.set(x, hy + 4, hz, C.accent); g.set(x, hy + 5, hz - 1, C.accent); }
    }

    // ---- 다리 (굵게, 발톱 세 개)
    for (const [zx, zz] of [[-3, 5], [-3, -6]]) {
      g.box(zx, 1, zz, zx + 1, 5, zz + 1, C.body);
      if (p.bulky || true) g.box(zx - 1, 4, zz, zx - 1, 6, zz + 1, C.body);   // 허벅지
      g.box(zx, 0, zz - 1, zx + 1, 0, zz + 2, C.dark);                         // 발
      for (const dz of [zz - 1, zz + 1, zz + 3]) g.set(zx, 0, dz + (dz === zz + 3 ? 0 : 0), C.tooth);
      g.set(zx + 1, 0, zz + 3, C.tooth);
    }

    // ---- 꼬리 (길고 가시 달림)
    const tail = [[-9, 6, 2], [-10, 6, 2], [-11, 6, 1], [-12, 7, 1], [-13, 7, 1], [-14, 8, 1], [-15, 9, 0], [-16, 10, 0], [-17, 11, 0], [-18, 12, 0]];
    tail.forEach(([z, y, th], i) => {
      g.box(-th, y, z, th, y + (th ? 1 : 0), z, C.body);
      if (i % 2 === 0) g.set(0, y + (th ? 2 : 1), z, C.dark);   // 가시
    });
    if (p.tailTip === 'leaf') { g.box(-2, 12, -19, 2, 14, -19, C.wing); g.box(-1, 15, -19, 1, 15, -19, C.wing); g.set(0, 13, -20, C.wingVein); g.set(0, 16, -19, C.wing); }
    else if (p.tailTip === 'club') { g.box(-2, 11, -19, 2, 14, -21, C.dark); g.set(0, 15, -20, C.dark); g.set(-2, 12, -22, C.tooth); g.set(2, 12, -22, C.tooth); }
    else if (p.tailTip === 'blade') { for (let k = 0; k <= 4; k++) { g.set(0, 12 + k, -19 - Math.floor(k / 2), C.accent); } g.set(0, 11, -19, C.accent); g.set(0, 13, -21, C.accent); }

    // ---- 날개 (크게)
    const sx = -3, sy = 10, sz = 1;
    function wingPlane(W, rise, sweep, tipStyle) {
      for (let i = 1; i <= W; i++) {
        const y = sy + Math.round(i * rise);
        const zBack = sz - Math.round(i * sweep) - 1, zFront = sz + 2 - (i > W - 3 ? Math.ceil((i - (W - 3)) / 2) : 0);
        for (let z = zBack; z <= zFront; z++) {
          let c = C.wing;
          if (z === zFront || z === zFront - 1 && i <= 2) c = C.dark;                     // 앞 뼈
          else if ((z - zBack) % 4 === 0 && i > 1) c = C.wingVein;                        // 잎맥
          else if (i === W && z === zBack) c = C.dark;
          g.set(sx - i, y, z, c);
        }
        if (i <= 2) g.box(sx - i, y - 1, sz, sx - i, y - 1, sz + 1, C.dark);                 // 어깨 관절
        if (i % 4 === 0) { g.set(sx - i, y, zBack - 1, C.dark); g.set(sx - i, y - 1, zBack - 1, C.tooth); } // 막 끝 뼈·갈고리
      }
      const tipX = sx - W - 1, tipY = sy + Math.round(W * rise);
      if (tipStyle === 'claw') { g.set(tipX, tipY, sz + 2, C.dark); g.set(tipX - 1, tipY, sz + 2, C.tooth); g.set(tipX, tipY + 1, sz + 1, C.dark); }
      if (tipStyle === 'spike') { g.set(tipX, tipY + 1, sz + 1, C.accent); g.set(tipX - 1, tipY + 2, sz + 1, C.accent); g.set(tipX - 2, tipY + 3, sz + 1, C.accent); }
    }
    if (p.wing === 'leaf')  wingPlane(14, 0.6, 1.0, 'claw');
    if (p.wing === 'stub')  wingPlane(9, 0.5, 0.8, 'claw');
    if (p.wing === 'plate') wingPlane(12, 0.8, 0.8, 'spike');

    g.mirror();
    return g.list();
  }

  function build(p, stage) { return stage === 'adult' ? buildAdult(p) : buildBaby(p); }

  const DRAGONS = {
    wood: {
      id: 'wood', name: '나무 드래곤', tier: 1, colorName: '갈색',
      recipe: '나무 원목 5, 나무 묘목 1~2, 나뭇잎 2', signature: '나무 세우기', beam: '약한 녹색 빔',
      seed: 11, scaleNoise: 0.25, horn: 'spiky', wing: 'leaf', tailTip: 'leaf', spineStyle: 'thorn', bulky: false,
      colors: { body: '#8B5A2B', belly: '#C9A066', dark: '#5C3A1A', accent: '#3E2A14', wing: '#5CA83A', wingVein: '#3F7F28', eye: '#D9F25A', eyeDark: '#1F2A0F', tooth: '#F4EFE1' }
    },
    earth: {
      id: 'earth', name: '대지 드래곤', tier: 2, colorName: '회색',
      recipe: '흙 2, 돌 2', signature: '흙과 돌 떨어뜨리기', beam: '약한 회색 빔',
      seed: 22, scaleNoise: 0.4, horn: 'ears', wing: 'stub', tailTip: 'club', spineStyle: 'thorn', bulky: true, armor: true,
      colors: { body: '#7F7F7F', belly: '#B0B0B0', dark: '#555555', accent: '#6B4A2B', wing: '#8E8E8E', wingVein: '#6A6A6A', eye: '#F2B84B', eyeDark: '#2A1E0A', tooth: '#F4EFE1' }
    },
    iron: {
      id: 'iron', name: '철 드래곤', tier: 3, colorName: '은색',
      recipe: '철 2', signature: '철 블록 날리기', beam: '약간 센 은색 빔',
      seed: 33, scaleNoise: 0.15, horn: 'blade', wing: 'plate', tailTip: 'blade', spineStyle: 'blade', bulky: false, plates: true,
      colors: { body: '#9AA4AD', belly: '#CDD5DB', dark: '#5F6A73', accent: '#3F4A53', wing: '#B7C1C9', wingVein: '#7F8B94', eye: '#57D3F5', eyeDark: '#0D2B36', tooth: '#F7FAFC' }
    },
    ender: {
      id: 'ender', name: '엔더 드래곤', tier: 16, colorName: '검정·보라',
      recipe: '드래곤의 숨결 4, 엔더 드래곤의 알 1', signature: '드래곤의 숨결 뿌리기', beam: '가장 강력한 보라·검정 빔',
      seed: 66, scaleNoise: 0.35, horn: 'blade', wing: 'plate', tailTip: 'blade', spineStyle: 'blade', bulky: true, armor: true, plates: true,
      colors: { body: '#1E1B24', belly: '#3A2F4A', dark: '#0F0D14', accent: '#5B2E91', wing: '#2A2136', wingVein: '#6D3FB3', eye: '#E040FB', eyeDark: '#3A0F5C', tooth: '#EDE7F6' },
      _note: '우리 게임의 엔더 드래곤 — 아들 설계(티어 16, 검정·보라 빔, 엔더맨 군대)를 우리 생성기 골격으로 만든 자체 디자인'
    }
  };

  function model(id, stage) { const p = DRAGONS[id]; stage = stage || 'baby'; return { ...meta(p), stage, voxels: build(p, stage) }; }
  function modelBoth(id) { const p = DRAGONS[id]; return { ...meta(p), baby: build(p, 'baby'), adult: build(p, 'adult') }; }
  function meta(p) { const { seed, scaleNoise, horn, wing, tailTip, spineStyle, bulky, armor, plates, colors, ...m } = p; return { ...m, colors }; }

  return { DRAGONS, build, model, modelBoth, stages: ['baby', 'adult'], ids: Object.keys(DRAGONS) };
});
