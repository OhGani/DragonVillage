/**
 * 마을 룸 관리: 코드 → 룸. 없으면 저장소에서 불러오고, 새 마을은 시드·코드를 만든다.
 */
import { DEFAULT_VILLAGE_SEED, VILLAGE_GEN_VERSION, type BlockRegistry, type VillageInfo } from '@dragon-village/shared';
import { randomInt } from 'node:crypto';
import type { Storage } from './storage';
import { VillageRoom } from './village';

export const DEFAULT_VILLAGE_NAME = '드래곤 빌리지';

export class RoomManager {
  private readonly rooms = new Map<string, VillageRoom>();

  constructor(
    private readonly storage: Storage,
    private readonly registry: BlockRegistry,
    private readonly log: (msg: string) => void,
  ) {}

  /** 마을 코드: 숫자 6자리, 겹치지 않게 */
  private newCode(): string {
    for (let i = 0; i < 100; i++) {
      const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
      if (!this.storage.getVillage(code) && !this.rooms.has(code)) return code;
    }
    throw new Error('마을 코드를 만들 수 없어요');
  }

  /** 기본 마을이 없으면 만든다 (아빠·아들의 마을). 코드를 정해 줄 수 있다 */
  ensureDefault(preferredCode?: string): VillageRoom {
    const list = this.storage.listVillages();
    if (list.length > 0) return this.get(list[0].code)!;
    const code = preferredCode && /^\d{6}$/.test(preferredCode) ? preferredCode : this.newCode();
    return this.createWith({ code, name: DEFAULT_VILLAGE_NAME, seed: DEFAULT_VILLAGE_SEED, genVersion: VILLAGE_GEN_VERSION });
  }

  get(code: string): VillageRoom | null {
    const cached = this.rooms.get(code);
    if (cached) return cached;
    const row = this.storage.getVillage(code);
    if (!row) return null;
    const room = new VillageRoom({ code: row.code, name: row.name, seed: row.seed, genVersion: row.genVersion }, this.registry, this.storage, this.log);
    this.rooms.set(code, room);
    return room;
  }

  create(name: string): VillageRoom {
    return this.createWith({ code: this.newCode(), name, seed: randomInt(1, 2 ** 31 - 1), genVersion: VILLAGE_GEN_VERSION });
  }

  private createWith(info: VillageInfo): VillageRoom {
    this.storage.createVillage({ code: info.code, name: info.name, seed: info.seed, genVersion: info.genVersion, createdAt: Date.now() });
    const room = new VillageRoom(info, this.registry, this.storage, this.log);
    this.rooms.set(info.code, room);
    this.log(`새 마을 "${info.name}" 코드 ${info.code} 시드 ${info.seed}`);
    return room;
  }

  all(): VillageRoom[] {
    return [...this.rooms.values()];
  }

  tick(now: number): void {
    for (const r of this.rooms.values()) r.tick(now);
  }

  flushAll(now: number): void {
    for (const r of this.rooms.values()) r.flush(now);
  }

  get playerCount(): number {
    let n = 0;
    for (const r of this.rooms.values()) n += r.playerCount;
    return n;
  }
}
