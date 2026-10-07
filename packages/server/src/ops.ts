/**
 * 운영 (M9-4, #153): 접속 로그 파일, 예상치 못한 종료 감지, 부모 페이지에 보여 줄 상태.
 *
 * - 접속 로그: DATA_DIR/logs/access-YYYY-MM-DD.log 에 입장·퇴장·원정·방어전 한 줄씩 (서버 콘솔 로그 중 그 줄만 복사)
 * - 죽음 감지: 켜질 때 DATA_DIR/running.lock 이 남아 있으면 지난번에 깨끗이 안 끝난 것 → logs/crashes.log 에 적고 부모 페이지에 띄운다.
 *   깨끗이 끝낼 때(SIGINT·SIGTERM) 는 lock 을 지운다. 우리가 손으로 죽여 다시 켤 때는 lock 을 먼저 지우면 "죽음"으로 안 센다
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ACCESS_RE = /입장|퇴장|원정|방어전|끊겼|새 마을|코드/;

function stamp(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export interface OpsStatus {
  startedAt: string;
  /** 마지막 예상치 못한 종료 기록 (없으면 null) */
  lastCrash: string | null;
  crashes: string[];
  access: string[];
}

export class Ops {
  private readonly logsDir: string;
  private readonly lockFile: string;
  readonly startedAt = stamp();
  private lastCrash: string | null = null;

  constructor(dataDir: string) {
    this.logsDir = join(dataDir, 'logs');
    this.lockFile = join(dataDir, 'running.lock');
    mkdirSync(this.logsDir, { recursive: true });
  }

  /** 켜질 때 한 번: 지난번 lock 이 남아 있으면 죽었던 것 */
  detectCrash(): string | null {
    if (existsSync(this.lockFile)) {
      let since = '';
      try {
        since = readFileSync(this.lockFile, 'utf8').trim();
      } catch {
        /* 무시 */
      }
      const line = `${this.startedAt} 다시 켜짐 — 지난번(${since || '?'} 에 켬)은 깨끗이 안 끝났어요 (죽었거나 강제 종료)`;
      appendFileSync(join(this.logsDir, 'crashes.log'), line + '\n');
      this.lastCrash = line;
    }
    writeFileSync(this.lockFile, this.startedAt + '\n');
    return this.lastCrash;
  }

  /** 깨끗이 끝낼 때 */
  markStopped(): void {
    try {
      unlinkSync(this.lockFile);
    } catch {
      /* 이미 없음 */
    }
  }

  /** 서버 로그 한 줄 — 접속에 관한 것이면 날짜별 파일에도 */
  note(msg: string): void {
    if (!ACCESS_RE.test(msg)) return;
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    const file = join(this.logsDir, `access-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.log`);
    try {
      appendFileSync(file, `${stamp(d)} ${msg}\n`);
    } catch {
      /* 디스크 문제는 게임을 막지 않는다 */
    }
  }

  private tail(file: string, n: number): string[] {
    if (!existsSync(file)) return [];
    try {
      const lines = readFileSync(file, 'utf8').split('\n').filter((l) => l.length > 0);
      return lines.slice(-n);
    } catch {
      return [];
    }
  }

  status(): OpsStatus {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    const today = `access-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.log`;
    const y = new Date(d.getTime() - 86_400_000);
    const yesterday = `access-${y.getFullYear()}-${p(y.getMonth() + 1)}-${p(y.getDate())}.log`;
    const access = [...this.tail(join(this.logsDir, yesterday), 60), ...this.tail(join(this.logsDir, today), 60)].slice(-60);
    const crashes = this.tail(join(this.logsDir, 'crashes.log'), 5);
    return { startedAt: this.startedAt, lastCrash: this.lastCrash ?? (crashes.length ? crashes[crashes.length - 1]! : null), crashes, access };
  }
}
