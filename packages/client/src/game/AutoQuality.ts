import type * as THREE from 'three';

/**
 * 프레임이 떨어지면 해상도 배율을 낮추고, 여유가 생기면 올린다.
 * 폰 30fps / PC 60fps 목표. 렌더 거리 축소는 ChunkRenderer 쪽에서 콜백으로.
 */
export class AutoQuality {
  /** 프레임 시간 이동 평균 (ms) */
  ema = 16;
  pixelRatio: number;
  readonly maxPixelRatio: number;
  readonly minPixelRatio = 0.5;
  private timer = 0;
  private goodStreak = 0;
  onChange: ((pr: number) => void) | null = null;

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    isTouch: boolean,
  ) {
    const dpr = window.devicePixelRatio || 1;
    this.maxPixelRatio = Math.min(dpr, isTouch ? 1.5 : 2);
    this.pixelRatio = isTouch ? Math.min(dpr, 1.0) : this.maxPixelRatio;
    this.apply();
  }

  private apply(): void {
    this.renderer.setPixelRatio(this.pixelRatio);
    const c = this.renderer.domElement;
    this.renderer.setSize(c.clientWidth || window.innerWidth, c.clientHeight || window.innerHeight, false);
    this.onChange?.(this.pixelRatio);
  }

  frame(dt: number): void {
    this.ema = this.ema * 0.94 + dt * 1000 * 0.06;
    this.timer += dt;
    if (this.timer < 2) return;
    this.timer = 0;
    if (this.ema > 36 && this.pixelRatio > this.minPixelRatio) {
      this.pixelRatio = Math.max(this.minPixelRatio, this.pixelRatio - 0.25);
      this.goodStreak = 0;
      this.apply();
    } else if (this.ema < 14 && this.pixelRatio < this.maxPixelRatio) {
      if (++this.goodStreak >= 3) {
        this.pixelRatio = Math.min(this.maxPixelRatio, this.pixelRatio + 0.25);
        this.goodStreak = 0;
        this.apply();
      }
    } else {
      this.goodStreak = 0;
    }
  }

  resize(): void {
    this.apply();
  }
}
