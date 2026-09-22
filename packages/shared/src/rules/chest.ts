/**
 * 상자 (결정 #84, 아빠 2026-09-22).
 *
 * - 상자를 탭하면 열린다(놓기 대신). 안에 든 것은 서버가 기억한다 — 나가도, 서버를 껐다 켜도 그대로.
 * - 상자는 **도끼나 손으로 부술 때만** 없어진다. 부수면 안에 있던 것이 부순 사람 가방으로 들어온다.
 * - **큰 상자**: 이미 있는 상자 바로 옆에 상자를 놓으면 둘이 하나로 합쳐져 54칸이 된다(아빠 규칙).
 *   · 두 상자 **위 칸이 둘 다 뚫려 있어야** 한다(공기·유리처럼 안 막는 블록).
 *   · **최대 2개**까지만. 이미 합쳐진 상자에는 더 못 붙인다.
 *   · 합쳐진 상자는 `chest@n/e/s/w` 변형(짝이 있는 방향)으로 놓이고, 한쪽을 부수면 남은 쪽은 다시 혼자 상자가 된다.
 * - 옮기기는 가방과 같은 규칙(`move`). 칸 번호는 0~(상자칸−1) 상자, 그다음이 가방이다.
 */
import { INV_SLOTS, type Inventory, type Slot, move } from './inventory';

/** 혼자 있는 상자 칸 수 (마인크래프트와 같은 27칸) */
export const CHEST_SLOTS = 27;
/** 큰 상자(둘이 합쳐진 것) 칸 수 */
export const BIG_CHEST_SLOTS = CHEST_SLOTS * 2;

export function chestSlotCount(paired: boolean): number {
  return paired ? BIG_CHEST_SLOTS : CHEST_SLOTS;
}

export function emptyChest(paired = false): Inventory {
  return new Array<Slot | null>(chestSlotCount(paired)).fill(null);
}

/** 칸 수를 바꾼다 (합쳐질 때 27 → 54, 나뉠 때 54 → 27: 넘치는 것은 돌려준다) */
export function resizeChest(chest: Inventory, paired: boolean): { chest: Inventory; spilled: Slot[] } {
  const n = chestSlotCount(paired);
  const out = chest.slice(0, n);
  while (out.length < n) out.push(null);
  const spilled = chest.slice(n).filter((s): s is Slot => s !== null);
  return { chest: out, spilled };
}

/**
 * 상자 ↔ 가방 옮기기. from·to 는 이어 붙인 번호(0~상자칸−1 상자, 그다음 가방).
 * 성공하면 바뀐 상자·가방을 돌려준다. 못 옮기면 null
 */
export function moveBetween(chest: Inventory, bag: Inventory, from: number, to: number, count: number): { chest: Inventory; bag: Inventory } | null {
  if (bag.length !== INV_SLOTS) return null;
  const n = chest.length;
  if (n !== CHEST_SLOTS && n !== BIG_CHEST_SLOTS) return null;
  const all = [...chest, ...bag];
  if (!move(all, from, to, count)) return null;
  return { chest: all.slice(0, n), bag: all.slice(n) };
}

/** 저장·전송에서 온 것이 올바른 상자인가 */
export function isValidChest(v: unknown): v is Inventory {
  if (!Array.isArray(v) || (v.length !== CHEST_SLOTS && v.length !== BIG_CHEST_SLOTS)) return false;
  return v.every((s) => s === null || (typeof s === 'object' && s !== null && typeof (s as Slot).item === 'string' && Number.isInteger((s as Slot).count) && (s as Slot).count > 0));
}

/** 상자에 든 물건 수 */
export function chestCount(chest: Inventory): number {
  return chest.reduce((n, s) => n + (s ? s.count : 0), 0);
}

/** 두 칸 중 어느 쪽이 "대표" 칸인가 (x 가 작은 쪽, 같으면 z 가 작은 쪽). 큰 상자의 내용은 대표 칸에 저장한다 */
export function chestPrimary(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
  if (a.x !== b.x) return a.x < b.x ? a : b;
  return a.z <= b.z ? a : b;
}
