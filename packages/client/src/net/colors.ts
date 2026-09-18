/** 플레이어 색 16가지 (양털 색). 번호가 서버에 저장된다 */
export const PLAYER_COLORS: readonly { name: string; hex: number }[] = [
  { name: '하양', hex: 0xf0f0f0 },
  { name: '주황', hex: 0xf07613 },
  { name: '자홍', hex: 0xbd44b3 },
  { name: '하늘', hex: 0x3aafd9 },
  { name: '노랑', hex: 0xf8c627 },
  { name: '연두', hex: 0x70b919 },
  { name: '분홍', hex: 0xed8dac },
  { name: '회색', hex: 0x3e4447 },
  { name: '연회색', hex: 0x8e8e86 },
  { name: '청록', hex: 0x158991 },
  { name: '보라', hex: 0x792aac },
  { name: '파랑', hex: 0x35399d },
  { name: '갈색', hex: 0x724728 },
  { name: '초록', hex: 0x546d1b },
  { name: '빨강', hex: 0xa12722 },
  { name: '검정', hex: 0x141519 },
];

export function colorHex(idx: number): number {
  return PLAYER_COLORS[((idx % PLAYER_COLORS.length) + PLAYER_COLORS.length) % PLAYER_COLORS.length].hex;
}
export function colorCss(idx: number): string {
  return '#' + colorHex(idx).toString(16).padStart(6, '0');
}
