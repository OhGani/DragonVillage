/**
 * 펫 이름 (M8-1 4차, 결정 #109): `data/pet-names.json` 의 목록에서만 고른다 — 규칙 3(자유 입력 없음).
 * 길들인 강아지 주인만 붙일 수 있고, 이름은 animals 표에 저장돼 모두에게 머리 위 글자로 보인다.
 */
import { z } from 'zod';

const Raw = z.object({ names: z.array(z.string().min(1, '이름이 비었어요').max(6, '이름은 6글자까지예요')).min(1, '이름이 하나는 있어야 해요') }).loose();

export class PetNameRegistry {
  private readonly set: ReadonlySet<string>;
  constructor(readonly names: readonly string[]) {
    this.set = new Set(names);
  }
  has(name: string): boolean {
    return this.set.has(name);
  }
}

export function parsePetNames(raw: unknown, fileName = 'data/pet-names.json'): PetNameRegistry {
  const result = Raw.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || '(전체)'}: ${i.message}`);
    throw new Error(`${fileName} 에 문제가 있어요:\n${lines.join('\n')}`);
  }
  const names = [...new Set(result.data.names.map((n) => n.trim()).filter((n) => n.length > 0))];
  return new PetNameRegistry(names);
}
