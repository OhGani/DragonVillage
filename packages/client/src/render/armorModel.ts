/**
 * 갑옷 덧입히기 (M8-2 2차): 다른 사람 인형 위에 입은 갑옷을 한 칸 두께 껍질로 그린다.
 * 부위 메시(머리·몸통·팔·다리)의 자식으로 붙여 걷기·팔 흔들기와 같이 움직인다. 좌표는 부위 기준(playerModel 과 같다).
 * 색은 등급(가죽·철·황금·다이아몬드·네더라이트·거북) — 아이콘과 같은 색. 얼굴은 비워 둔다(투구는 챙만), 몸통 옆은 팔이 가리므로 어깨 판만.
 * 서로 붙은 부위(팔 안쪽·다리 안쪽)는 껍질을 빼서 겹치지 않게 한다 → 왼쪽/오른쪽 다른 복셀.
 */
import { type ArmorSlot, type Equipment, armorOf } from '@dragon-village/shared';
import { COMBAT } from '@dragon-village/shared/data';
import { fill } from './playerModel';
import type { Voxel } from './voxelGeometry';

/** 등급 색 (itemIcon MATERIAL_COLOR 와 같게) */
export const ARMOR_COLORS: Readonly<Record<string, number>> = {
  leather: 0x8a5a3c,
  iron: 0xd8d8d8,
  golden: 0xf2c94c,
  diamond: 0x5fd8e8,
  netherite: 0x4a3f4a,
  turtle: 0x4f8a3a,
};

export interface ArmorVoxels {
  head: Voxel[];
  torso: Voxel[];
  armL: Voxel[];
  armR: Voxel[];
  legL: Voxel[];
  legR: Voxel[];
}

function colorOf(eq: Equipment, slot: ArmorSlot): number | null {
  const a = armorOf(COMBAT, eq[slot]);
  return a ? (ARMOR_COLORS[a.tier] ?? 0xb0b0b0) : null;
}

/** 입은 갑옷의 부위별 껍질 복셀. 안 입은 부위는 빈 배열 */
export function armorVoxels(eq: Equipment): ArmorVoxels {
  const out: ArmorVoxels = { head: [], torso: [], armL: [], armR: [], legL: [], legR: [] };
  const helmet = colorOf(eq, 'helmet');
  if (helmet !== null) {
    const c = () => helmet;
    // 머리 8×8×8 (x −4..3, y 0..7, z −4..3) 둘레: 윗판·양옆·뒤 + 앞은 이마 챙(y 7·8)
    out.head.push(...fill(-5, 4, 8, 8, -5, 4, c)); // 윗판
    out.head.push(...fill(-5, -5, 0, 7, -4, 3, c), ...fill(4, 4, 0, 7, -4, 3, c)); // 옆
    out.head.push(...fill(-4, 3, 0, 7, 4, 4, c)); // 뒤
    out.head.push(...fill(-4, 3, 7, 7, -5, -5, c)); // 이마 챙
  }
  const chest = colorOf(eq, 'chestplate');
  if (chest !== null) {
    const c = () => chest;
    // 몸통 8×12×4 (x −4..3, y 0..11, z −2..1): 앞·뒤 판 (가장자리 x 는 어깨 판이 맡는다)
    out.torso.push(...fill(-3, 2, 1, 11, -3, -3, c), ...fill(-3, 2, 1, 11, 2, 2, c));
    // 어깨 판: 팔 위쪽(y −3..0) 바깥·앞·뒤·위. 안쪽(몸통 쪽)은 뺀다
    const pad = (outerX: number): Voxel[] => [
      ...fill(-2, 1, 0, 0, -2, 1, c), // 위
      ...fill(-2, 1, -3, -1, -3, -3, c), // 앞
      ...fill(-2, 1, -3, -1, 2, 2, c), // 뒤
      ...fill(outerX, outerX, -3, -1, -2, 1, c), // 바깥
    ];
    out.armL.push(...pad(-3));
    out.armR.push(...pad(2));
  }
  const legs = colorOf(eq, 'leggings');
  if (legs !== null) {
    const c = () => legs;
    // 다리 4×12×4 (y −12..−1) 의 위 8칸 (y −8..−1): 앞·뒤·바깥
    const leg = (outerX: number): Voxel[] => [...fill(-2, 1, -8, -1, -3, -3, c), ...fill(-2, 1, -8, -1, 2, 2, c), ...fill(outerX, outerX, -8, -1, -2, 1, c)];
    out.legL.push(...leg(-3));
    out.legR.push(...leg(2));
  }
  const boots = colorOf(eq, 'boots');
  if (boots !== null) {
    const c = () => boots;
    // 신발 3칸 + 한 칸 (y −12..−9): 앞·뒤·바깥. 바닥은 땅이라 뺀다
    const boot = (outerX: number): Voxel[] => [...fill(-2, 1, -12, -9, -3, -3, c), ...fill(-2, 1, -12, -9, 2, 2, c), ...fill(outerX, outerX, -12, -9, -2, 1, c)];
    out.legL.push(...boot(-3));
    out.legR.push(...boot(2));
  }
  return out;
}

/** 방패: 왼팔 바깥에 붙는 판 (몸통 색 위에 철 테두리). 부위 기준 좌표(왼팔) */
export function shieldVoxels(): Voxel[] {
  const wood = () => 0xa0703a,
    iron = () => 0xd8d8d8;
  const out: Voxel[] = [];
  // 왼팔(x −2..1) 바깥 x −4 에 6×10 판, 팔 중간(y −9..0) 높이
  out.push(...fill(-4, -4, -9, 0, -3, 2, (_x, y, z) => (y === 0 || y === -9 || z === -3 || z === 2 ? iron() : wood())));
  return out;
}
