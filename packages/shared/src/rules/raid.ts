/**
 * 마을 방어전 규칙 (M7-5, docs/BOSSES.md "마을 방어전", bosses.json raids). 순수 함수 — 서버가 돌리고 클라는 표시.
 *
 * - 호스트(마을에 있는 사람 아무나)가 광장 깃대 옆에서 시작한다. 절대 자동 시작 없음. 마을 레벨 minVillageLevel 부터, 일주일에 maxPerWeek 번.
 * - 시작하면 종이 울리고 RAID_WARNING_SEC 뒤 첫 파도. 파도 3번: 변명자(도끼)·약탈자(석궁, 6칸에서 쏜다) → 마지막 파도엔 소환사(보스, 변명자를 부른다).
 *   우민은 북쪽 강 너머(포탈 뒤)에서 나와 **광장 깃대**로 걸어온다. 사람이 가까이 있으면 사람을 쫓는다.
 * - 깃대 RAID_FLAG_R 안에 우민이 있고 RAID_DEFEND_R 안에 사람이 없으면 점령 시간이 쌓인다 → RAID_CAPTURE_SEC 이면 패배. 시간이 다 돼도 패배.
 * - 마을 블록은 하나도 안 부서진다(몹은 블록을 안 건드린다). 패배하면 깃대 맨 위 깃발이 검은 깃발(흑요석), 승리하면 금 깃발(금 블록).
 * - 승리: 마을에 있는 모두 경험치 xpEach, 소환사 전리품은 마을 창고(협동 보스 규칙 #98).
 */
import { z } from 'zod';
import { DataError, koreanizeMessage } from './blocks';
import type { MobKind } from './mobs';

const RaidFile = z
  .object({
    raids: z
      .object({
        durationSec: z.number().int().positive(),
        minVillageLevel: z.number().int().min(1),
        maxPerWeek: z.number().int().min(1),
        waves: z.number().int().min(1).max(9),
        onWin: z.object({ xpEach: z.number().int().min(0) }).loose(),
      })
      .loose(),
  })
  .loose();

export interface RaidRules {
  readonly durationSec: number;
  readonly minVillageLevel: number;
  readonly maxPerWeek: number;
  readonly waves: number;
  readonly xpEach: number;
}

export function parseRaid(raw: unknown, fileName = 'data/bosses.json'): RaidRules {
  const r = RaidFile.safeParse(raw);
  if (!r.success) throw new DataError(fileName, r.error.issues.map((i) => `${i.path.map(String).join('.')}: ${koreanizeMessage(i.message)}`));
  const d = r.data.raids;
  return { durationSec: d.durationSec, minVillageLevel: d.minVillageLevel, maxPerWeek: d.maxPerWeek, waves: d.waves, xpEach: d.onWin.xpEach };
}

/** 종이 울린 뒤 첫 파도까지 */
export const RAID_WARNING_SEC = 45;
/** 파도를 다 잡지 못해도 이 시간이 지나면 다음 파도가 온다 */
export const RAID_WAVE_MAX_SEC = 150;
/** 파도를 다 잡으면 이만큼 숨 돌리고 다음 파도 */
export const RAID_WAVE_REST_SEC = 8;
/** 깃대 점령: 이 반지름 안에 우민, 이 반지름 안에 사람 없음, 이만큼 쌓이면 패배 */
export const RAID_FLAG_R = 2.5;
export const RAID_DEFEND_R = 6;
export const RAID_CAPTURE_SEC = 15;
/** 우민이 사람을 쫓기 시작하는 거리 (그 밖이면 깃대로 간다) */
export const RAID_AGGRO_R = 24;
/** 일주일 (주 N회 판정) */
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type RaidPhase = 'warning' | 'wave' | 'won' | 'lost';

/** 클라에 1Hz 로 가는 방어전 상태 */
export interface RaidStateInfo {
  phase: RaidPhase;
  /** 1부터. warning 이면 0 */
  wave: number;
  waves: number;
  /** 살아 있는 우민 */
  remaining: number;
  /** 방어전 전체 남은 초 */
  secLeft: number;
  /** 첫 파도까지(warning) 남은 초 */
  warnLeft: number;
  /** 깃대 점령 진행 0~RAID_CAPTURE_SEC */
  capture: number;
}

/**
 * 파도별 우민 — 사람이 많으면 변명자가 한 명당 하나 더 (기본 2명 기준).
 * 아들 13차 답(2026-10-07, #128) "쉬웠음, 우민 수 늘려줘": 4·2 → 5·3 → 소환사 + 4·3 (전엔 3·1 → 3·2 → 소환사 + 2·2)
 */
export function raidWave(wave: number, waves: number, players: number): MobKind[] {
  const extra = Math.max(0, players - 2);
  const list: MobKind[] = [];
  const push = (k: MobKind, n: number) => {
    for (let i = 0; i < n; i++) list.push(k);
  };
  if (wave >= waves) {
    push('evoker', 1);
    push('vindicator', 4 + extra);
    push('pillager', 3);
  } else if (wave === 1) {
    push('vindicator', 4 + extra);
    push('pillager', 2);
  } else {
    push('vindicator', 5 + extra);
    push('pillager', 3 + Math.floor(extra / 2));
  }
  return list;
}

/** 우민이 나오는 자리 — 북쪽 포탈 뒤, 강 남쪽 둔치 (x 60~68, z 36~38). i 번째는 옆으로 퍼진다 */
export function raidSpawnSpot(i: number): { x: number; z: number } {
  const cols = [64, 62, 66, 60, 68, 63, 65, 61, 67];
  return { x: cols[i % cols.length]! + 0.5, z: 36.5 + (Math.floor(i / cols.length) % 3) };
}
