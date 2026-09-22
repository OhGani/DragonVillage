/**
 * 가방(인벤토리) 규칙 — M4, 결정 #66. 순수 함수. 서버가 진실이고 클라는 같은 코드로 미리 보여 준다.
 *
 * 칸 배치: 0~9 핫바(게임 화면 아래 10칸), 10~36 가방 27칸. 한 칸엔 아이템 하나가 최대 STACK 개.
 * 결정론: 넣을 때는 같은 아이템이 있는 칸부터 채우고(앞에서부터), 그 다음 빈 칸(앞에서부터).
 */
export const HOTBAR_SLOTS = 10;
export const BAG_SLOTS = 27;
export const INV_SLOTS = HOTBAR_SLOTS + BAG_SLOTS; // 37
export const STACK = 64;

export interface Slot {
  item: string;
  count: number;
}
/** 칸 배열. null = 빈 칸 */
export type Inventory = (Slot | null)[];

export function emptyInventory(): Inventory {
  return new Array<Slot | null>(INV_SLOTS).fill(null);
}

export function cloneInventory(inv: Inventory): Inventory {
  return inv.map((s) => (s ? { ...s } : null));
}

/** 그 아이템이 전부 몇 개 */
export function countOf(inv: Inventory, item: string): number {
  let n = 0;
  for (const s of inv) if (s && s.item === item) n += s.count;
  return n;
}

/**
 * 넣는다. 못 넣고 남은 개수를 돌려준다(가득 차면 > 0). 바뀐 칸 번호는 changed 에 모은다.
 */
export function give(inv: Inventory, item: string, count: number, changed?: Set<number>): number {
  let left = count;
  for (let i = 0; i < inv.length && left > 0; i++) {
    const s = inv[i];
    if (s && s.item === item && s.count < STACK) {
      const add = Math.min(STACK - s.count, left);
      s.count += add;
      left -= add;
      changed?.add(i);
    }
  }
  for (let i = 0; i < inv.length && left > 0; i++) {
    if (inv[i] === null) {
      const add = Math.min(STACK, left);
      inv[i] = { item, count: add };
      left -= add;
      changed?.add(i);
    }
  }
  return left;
}

/** 뺀다(뒤 칸부터 — 핫바는 마지막에). 모자라면 아무것도 안 빼고 false */
export function take(inv: Inventory, item: string, count: number, changed?: Set<number>): boolean {
  if (countOf(inv, item) < count) return false;
  let left = count;
  for (let i = inv.length - 1; i >= 0 && left > 0; i--) {
    const s = inv[i];
    if (!s || s.item !== item) continue;
    const sub = Math.min(s.count, left);
    s.count -= sub;
    left -= sub;
    if (s.count === 0) inv[i] = null;
    changed?.add(i);
  }
  return true;
}

/** 특정 칸에서 count 개 뺀다 (손에 든 칸에서 놓기). 모자라면 false */
export function takeFromSlot(inv: Inventory, slot: number, count: number, changed?: Set<number>): boolean {
  const s = inv[slot];
  if (!s || s.count < count) return false;
  s.count -= count;
  if (s.count === 0) inv[slot] = null;
  changed?.add(slot);
  return true;
}

/**
 * 칸 옮기기: from 의 count 개를 to 로. to 가 비었으면 이동, 같은 아이템이면 합치기(넘치면 남김),
 * 다른 아이템이면 전부 옮길 때만 맞바꾸기. 성공하면 true.
 */
export function move(inv: Inventory, from: number, to: number, count: number, changed?: Set<number>): boolean {
  if (from === to || from < 0 || to < 0 || from >= inv.length || to >= inv.length) return false;
  const a = inv[from];
  if (!a || count <= 0 || count > a.count) return false;
  const b = inv[to];
  if (b === null) {
    inv[to] = { item: a.item, count };
    a.count -= count;
    if (a.count === 0) inv[from] = null;
  } else if (b.item === a.item) {
    const add = Math.min(STACK - b.count, count);
    if (add <= 0) return false;
    b.count += add;
    a.count -= add;
    if (a.count === 0) inv[from] = null;
  } else {
    if (count !== a.count) return false;
    inv[from] = b;
    inv[to] = a;
  }
  changed?.add(from);
  changed?.add(to);
  return true;
}

/** 이 물건들을 지금 가방에 다 넣을 수 있나 (넣어 보지는 않는다) */
export function fits(inv: Inventory, items: readonly Slot[]): boolean {
  const copy = cloneInventory(inv);
  for (const s of items) if (give(copy, s.item, s.count) > 0) return false;
  return true;
}

/** 재료 목록이 전부 있나 */
export function hasAll(inv: Inventory, needs: Readonly<Record<string, number>>): boolean {
  for (const [item, n] of Object.entries(needs)) if (countOf(inv, item) < n) return false;
  return true;
}

/** 모자란 재료 (아이템 → 모자란 개수) */
export function missing(inv: Inventory, needs: Readonly<Record<string, number>>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [item, n] of Object.entries(needs)) {
    const have = countOf(inv, item);
    if (have < n) out[item] = n - have;
  }
  return out;
}

/** 검증: 저장·전송에서 온 것이 올바른 가방인가 (아이템 id 형식·개수 범위) */
export function isValidInventory(v: unknown): v is Inventory {
  if (!Array.isArray(v) || v.length !== INV_SLOTS) return false;
  for (const s of v) {
    if (s === null) continue;
    if (!s || typeof s !== 'object') return false;
    const { item, count } = s as { item?: unknown; count?: unknown };
    if (typeof item !== 'string' || !/^[a-z0-9_.]+$/.test(item)) return false;
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > STACK) return false;
  }
  return true;
}
