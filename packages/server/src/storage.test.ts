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

    s.savePlayer({ token: 'ab'.repeat(16), village: '482913', nick: '아들', color: 5, x: 1.5, y: 41, z: 2.5, yaw: 0.5, pitch: -0.1, lastSeen: 999, xpTotal: 55, ridingDragon: null, equipment: null });
    expect(s.getPlayer('ab'.repeat(16))).toMatchObject({ nick: '아들', color: 5, x: 1.5, yaw: 0.5 });
    s.savePlayer({ token: 'ab'.repeat(16), village: '482913', nick: '아들2', color: 6, x: 3, y: 41, z: 4, yaw: 0, pitch: 0, lastSeen: 1000, xpTotal: 60, ridingDragon: null, equipment: '{"helmet":"iron_helmet"}' });
    expect(s.getPlayer('ab'.repeat(16))).toMatchObject({ nick: '아들2', x: 3, xpTotal: 60, ridingDragon: null, equipment: '{"helmet":"iron_helmet"}' });

    s.clearChunks('482913');
    expect(s.countChunks('482913')).toBe(0);
    s.close();
  });
});

describe('마을 코드 바꾸기 (#153)', () => {
  it('마을을 가리키는 표가 모두 새 코드로 옮겨진다', () => {
    const st = new Storage(':memory:');
    st.createVillage({ code: '111111', name: '테스트', seed: 1, genVersion: 1, createdAt: 1 });
    st.addBuilding('111111', 'forge', 1);
    st.setPlaced('111111', 1, 2, 3, 'a'.repeat(32), '아빠');
    st.renameVillage('111111', '222222');
    expect(st.getVillage('111111')).toBeUndefined();
    expect(st.getVillage('222222')?.name).toBe('테스트');
    expect(st.listBuildings('222222')).toEqual(['forge']);
    expect(st.listPlaced('222222')).toHaveLength(1);
    expect(st.listPlaced('111111')).toHaveLength(0);
  });
});
