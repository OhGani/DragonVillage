/**
 * 바이너리 메시지용 쓰기/읽기. 리틀 엔디언. 클라·서버가 같은 코드를 쓴다 (PROTOCOL.md).
 * 문자열은 UTF-8, 길이 u8 (블록 id·짧은 이름용).
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class ByteWriter {
  private buf: Uint8Array;
  private view: DataView;
  private pos = 0;

  constructor(capacity = 64) {
    this.buf = new Uint8Array(capacity);
    this.view = new DataView(this.buf.buffer);
  }

  private ensure(n: number): void {
    if (this.pos + n <= this.buf.length) return;
    let cap = this.buf.length * 2;
    while (cap < this.pos + n) cap *= 2;
    const next = new Uint8Array(cap);
    next.set(this.buf);
    this.buf = next;
    this.view = new DataView(next.buffer);
  }

  u8(v: number): this {
    this.ensure(1);
    this.view.setUint8(this.pos, v);
    this.pos += 1;
    return this;
  }
  u16(v: number): this {
    this.ensure(2);
    this.view.setUint16(this.pos, v, true);
    this.pos += 2;
    return this;
  }
  u32(v: number): this {
    this.ensure(4);
    this.view.setUint32(this.pos, v >>> 0, true);
    this.pos += 4;
    return this;
  }
  i32(v: number): this {
    this.ensure(4);
    this.view.setInt32(this.pos, v | 0, true);
    this.pos += 4;
    return this;
  }
  f32(v: number): this {
    this.ensure(4);
    this.view.setFloat32(this.pos, v, true);
    this.pos += 4;
    return this;
  }
  /** 짧은 문자열: u8 길이 + UTF-8 (255바이트까지) */
  str(s: string): this {
    const b = encoder.encode(s);
    if (b.length > 255) throw new RangeError(`문자열이 너무 길어요 (${b.length} > 255): ${s.slice(0, 20)}…`);
    this.u8(b.length);
    this.ensure(b.length);
    this.buf.set(b, this.pos);
    this.pos += b.length;
    return this;
  }
  /** 바이트 덩어리: u32 길이 + 내용 */
  bytes(b: Uint8Array): this {
    this.u32(b.length);
    this.ensure(b.length);
    this.buf.set(b, this.pos);
    this.pos += b.length;
    return this;
  }

  get length(): number {
    return this.pos;
  }

  /** 지금까지 쓴 만큼만 복사해 돌려준다 */
  finish(): Uint8Array {
    return this.buf.slice(0, this.pos);
  }
}

export class ByteReader {
  private readonly view: DataView;
  private pos = 0;

  constructor(private readonly buf: Uint8Array) {
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  private need(n: number): void {
    if (this.pos + n > this.buf.length) throw new RangeError(`메시지가 짧아요: ${this.pos + n} > ${this.buf.length}`);
  }

  u8(): number {
    this.need(1);
    const v = this.view.getUint8(this.pos);
    this.pos += 1;
    return v;
  }
  u16(): number {
    this.need(2);
    const v = this.view.getUint16(this.pos, true);
    this.pos += 2;
    return v;
  }
  u32(): number {
    this.need(4);
    const v = this.view.getUint32(this.pos, true);
    this.pos += 4;
    return v;
  }
  i32(): number {
    this.need(4);
    const v = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return v;
  }
  f32(): number {
    this.need(4);
    const v = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return v;
  }
  str(): string {
    const n = this.u8();
    this.need(n);
    const s = decoder.decode(this.buf.subarray(this.pos, this.pos + n));
    this.pos += n;
    return s;
  }
  bytes(): Uint8Array {
    const n = this.u32();
    this.need(n);
    const b = this.buf.slice(this.pos, this.pos + n);
    this.pos += n;
    return b;
  }

  get remaining(): number {
    return this.buf.length - this.pos;
  }
}
