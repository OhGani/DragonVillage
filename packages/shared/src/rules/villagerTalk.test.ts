import { describe, expect, it } from 'vitest';
import { VILLAGER_TALK } from './data';
import { parseVillagerTalk, talkMatches } from './villagerTalk';

describe('주민 대화 (#172)', () => {
  it('data/villager-talk.json 이 읽히고, 대화마다 대답 1~3개, 이름은 번호로 늘 같다', () => {
    expect(VILLAGER_TALK.talks.length).toBeGreaterThanOrEqual(8);
    for (const t of VILLAGER_TALK.talks) {
      expect(t.replies.length).toBeGreaterThanOrEqual(1);
      expect(t.replies.length).toBeLessThanOrEqual(3);
    }
    expect(VILLAGER_TALK.nameOf(40_017)).toBe(VILLAGER_TALK.nameOf(40_017));
    expect(VILLAGER_TALK.names).toContain(VILLAGER_TALK.nameOf(40_017));
  });

  it('상황에 맞는 대화를 고른다: 빵을 들면 빵 대화, 처음이면 인사, 드래곤 없으면 그 얘기, 아니면 any 를 돌아가며', () => {
    const base = { holding: null, hasDragon: true, level: 2, firstTalk: false };
    expect(VILLAGER_TALK.pick({ ...base, holding: 'bread' }, 1).id).toBe('bread');
    expect(VILLAGER_TALK.pick({ ...base, firstTalk: true }, 1).id).toBe('first_hello');
    const seen = (ctx: typeof base) => new Set(Array.from({ length: 60 }, (_, m) => VILLAGER_TALK.pick(ctx, 40_001 + m).id));
    expect(seen({ ...base, hasDragon: false })).toContain('no_dragon'); // 드래곤 없으면 그 얘기가 섞여 나온다
    expect(seen({ ...base, hasDragon: false })).not.toContain('dragon');
    expect(seen({ ...base, level: 3 })).toContain('portal');
    expect(seen(base)).not.toContain('portal'); // 레벨 2 는 포탈 3단계 얘기 없음
    const ids = seen(base);
    expect(ids.size).toBeGreaterThanOrEqual(3); // 돌아가며 나온다
    for (const id of ids) expect(['any', 'hasDragon']).toContain(VILLAGER_TALK.talks.find((t) => t.id === id)!.when);
    expect(VILLAGER_TALK.talks.find((t) => t.id === 'bread')!.replies[0]!.action).toBe('feed');
    expect(talkMatches('holding:wheat', { ...base, holding: 'wheat' })).toBe(true);
    expect(talkMatches('level>=5', base)).toBe(false);
  });

  it('잘못된 파일은 한국어로 알려 준다', () => {
    expect(() => parseVillagerTalk({ names: [], talks: [] })).toThrow(/이름이 하나는/);
    expect(() => parseVillagerTalk({ names: ['토리'], talks: [{ id: 'a', when: 'raining', say: '비', replies: [{ text: '응', answer: '그래' }] }] })).toThrow(/모르는 조건/);
    expect(() => parseVillagerTalk({ names: ['토리'], talks: [{ id: 'a', say: '비', replies: [] }] })).toThrow(/하나는 있어야/);
  });
});
