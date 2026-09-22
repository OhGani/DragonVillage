/**
 * 작은 효과음 (M6-1): 파일 없이 Web Audio 로 합성. 경험치 구슬 "딩"(음높이 흔들림)과 레벨업.
 * 브라우저가 소리를 막으면(사용자 입력 전) 조용히 넘어간다.
 */
let ctx: AudioContext | null = null;
/** 연출용 흔들림 (규칙 2 의 Math.random 금지는 지형·규칙 코드용 — 여기서도 시드 xorshift 로 통일) */
let rs = 0x9e3779b9;
function rnd(): number {
  rs ^= rs << 13;
  rs ^= rs >>> 17;
  rs ^= rs << 5;
  return (rs >>> 0) / 4294967296;
}

function audio(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, at: number, dur: number, gain = 0.12, type: OscillatorType = 'sine'): void {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0005, at + dur);
  o.connect(g).connect(c.destination);
  o.start(at);
  o.stop(at + dur + 0.02);
}

/** 경험치 구슬 흡수: 마인크래프트 느낌의 짧은 "딩", 음높이가 조금씩 다르다 */
export function ding(pitchJitter = 0.25): void {
  const c = audio();
  if (!c) return;
  const base = 1200 * (1 + (rnd() * 2 - 1) * pitchJitter);
  tone(base, c.currentTime, 0.14, 0.08);
  tone(base * 2, c.currentTime, 0.08, 0.03);
}

/** 레벨업: 짧은 상승 아르페지오 */
export function levelUp(): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  for (const [i, f] of [523.25, 659.25, 783.99, 1046.5].entries()) tone(f, t + i * 0.09, 0.22, 0.1, 'triangle');
}

/** 드래곤 빔 (M6-5): 낮게 울리다 쓸려 올라가는 소리. 세기(1~5)가 클수록 굵고 길다 */
export function beam(power = 1): void {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const p = Math.max(1, Math.min(5, power));
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(90 + 20 * p, t);
  o.frequency.exponentialRampToValueAtTime(400 + 160 * p, t + 0.25);
  o.frequency.exponentialRampToValueAtTime(140 + 30 * p, t + 0.9 + 0.1 * p);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05 + 0.015 * p, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0005, t + 1.0 + 0.1 * p);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 1.2 + 0.1 * p);
  tone(1600 + 200 * p, t, 0.12, 0.03); // 시작 순간의 반짝
}
