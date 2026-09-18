import { describe, expect, it } from 'vitest';
import { Storage } from './storage';

describe('Storage (SQLite 메모리)', () => {
  it('마을·청크·플레이어 라운드트립', () => {
    const s = new Storage(':memory:');
    expect(s.listVillages()).toEqual([]);
    s.createVillage({ code: '482913', name: '드래곤 빌리지', seed: 20260913, genVersion: 1, createdAt: 123 });
    expect(s.getVillage('482913')).toEqual({ code: '482913', name: '드래곤 빌리지', seed: 20260913, genVersion: 1, createdAt: 123 });
    expect(s.getVillage('000000')).toBeUndefined();

    const blob = new Uint8Array([1, 2, 3, 250, 251]);
    s.saveChunks('482913', [
      { cx: 1, cy: 2, cz: 3, blob },
      { cx: 0, cy: 0, cz: 0, blob: new Uint8Array([9]) },
    ]);
    expect(s.countChunks('482913')).toBe(2);
    // 덮어쓰기
    s.saveChunks('482913', [{ cx: 1, cy: 2, cz: 3, blob: new Uint8Array([7, 7]) }]);
    const rows = s.loadChunks('482913').sort((a, b) => a.cx - b.cx);
    expect(rows).toHaveLength(2);
    expect([...rows[1].blob]).toEqual([7, 7]);
    expect(s.loadChunks('other')).toEqual([]);

    s.savePlayer({ token: 'ab'.repeat(16), village: '482913', nick: '아들', color: 5, x: 1.5, y: 41, z: 2.5, yaw: 0.5, pitch: -0.1, lastSeen: 999 });
    expect(s.getPlayer('ab'.repeat(16))).toMatchObject({ nick: '아들', color: 5, x: 1.5, yaw: 0.5 });
    s.savePlayer({ token: 'ab'.repeat(16), village: '482913', nick: '아들2', color: 6, x: 3, y: 41, z: 4, yaw: 0, pitch: 0, lastSeen: 1000 });
    expect(s.getPlayer('ab'.repeat(16))).toMatchObject({ nick: '아들2', x: 3 });

    s.clearChunks('482913');
    expect(s.countChunks('482913')).toBe(0);
    s.close();
  });
});
