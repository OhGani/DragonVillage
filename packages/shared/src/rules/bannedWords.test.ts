import { describe, expect, it } from 'vitest';
import { BANNED_WORDS } from './data';
import { BannedWords, foldName, parseBannedWords } from './bannedWords';

describe('이름 금칙어 (#152)', () => {
  it('띄어쓰기·기호·대소문자를 무시하고 포함으로 잡는다, 멀쩡한 이름은 통과', () => {
    const b = new BannedWords(['씨발', 'fuck']);
    expect(b.find('씨발이')).toBe('씨발');
    expect(b.find('씨 발')).toBe('씨발');
    expect(b.find('씨.발.')).toBe('씨발');
    expect(b.find('FuCk99')).toBe('fuck');
    expect(b.find('아들')).toBeNull();
    expect(b.find('쁘뚜')).toBeNull();
    expect(b.find('')).toBeNull();
    expect(foldName('A b-c1')).toBe('abc');
  });
  it('실제 파일이 읽히고, 흔한 이름은 안 걸린다', () => {
    expect(BANNED_WORDS.count).toBeGreaterThan(10);
    for (const ok of ['아빠', '아들', '쁘뚜', '테스터', '친구', '초코', '보리', 'Steve', '드래곤']) expect(BANNED_WORDS.find(ok), ok).toBeNull();
    expect(BANNED_WORDS.find('개새끼123')).not.toBeNull();
    expect(() => parseBannedWords({ words: 'no' })).toThrow(/문제가 있어요/);
  });
});
