import { describe, expect, it } from 'vitest';
import { DataError } from './blocks';
import { PHRASES } from './data';
import { EMOTE_EMOJI, EMOTE_PHRASE, parsePhrases } from './phrases';

describe('채팅 문구', () => {
  it('실제 파일: 이모지 13 · 문구 20, 검증·글자', () => {
    expect(PHRASES.emojis.length).toBe(13);
    expect(PHRASES.phrases.length).toBe(20);
    expect(PHRASES.valid(EMOTE_EMOJI, 0)).toBe(true);
    expect(PHRASES.valid(EMOTE_EMOJI, 13)).toBe(false);
    expect(PHRASES.valid(EMOTE_PHRASE, 1)).toBe(true);
    expect(PHRASES.valid(EMOTE_PHRASE, 99)).toBe(false);
    expect(PHRASES.valid(7, 1)).toBe(false);
    expect(PHRASES.text(EMOTE_PHRASE, 1)).toBe('돌아가자');
    expect(PHRASES.text(EMOTE_EMOJI, 0)).toBe('🥰');
  });

  it('잘못된 값이면 한국어 DataError', () => {
    expect(() => parsePhrases({ emojis: [], phrases: [{ id: 1, text: 'a' }] })).toThrow(DataError);
    expect(() => parsePhrases({ emojis: ['😀'], phrases: [{ id: 1, text: 'a' }, { id: 1, text: 'b' }] })).toThrow(/두 번/);
    expect(() => parsePhrases({ emojis: ['😀'], phrases: [{ id: 1, text: '아주아주아주아주아주아주아주아주아주아주긴문구' }] })).toThrow(/20글자/);
  });
});
