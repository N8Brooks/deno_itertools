/** JavaScript equivalent of modulo operation */
const mod = (dividend: number, divisor: number): number => {
  return ((dividend % divisor) + divisor) % divisor;
};

export class Range {
  /** Starting value for the sequence */
  #start: number;

  /** No values are yielded equal to or beyond this */
  #stop: number;

  /** The amount added to `#value` per iteration */
  #step: number;

  constructor(start: number, stop: number, step: number) {
    if (step === 0) {
      throw new RangeError("Range `step` may not be `0`");
    }
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(stop) ||
      !Number.isSafeInteger(step)
    ) {
      throw new RangeError(`Range() parameters must be safe integers`);
    }
    this.#start = start;
    this.#stop = stop;
    this.#step = step;
  }

  /** Yields integers from `0` to `stop` */
  static from(stop: number): Range;

  /** Yields integers from `start` to `stop` */
  static from(start: number, stop: number): Range;

  /** Yields integers from `start` to `stop` with the given `step` size */
  static from(start: number, stop: number, step: number): Range;

  /** Factory method returning a `Range` instance */
  static from(start: number, stop?: number, step = 1): Range {
    return stop === undefined
      ? new Range(0, start, 1)
      : new Range(start, stop, step);
  }

  [Symbol.iterator](): IterableIterator<number> {
    const step = this.#step;
    let value = this.#start - step;
    const modulo = mod(this.#start - this.#stop, this.#step);
    const sentinel = this.#stop + modulo - step;
    return {
      next(): IteratorResult<number> {
        return value === sentinel
          ? { value: undefined, done: true }
          : { value: value += step };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }

  /** The number of elements in the `Range` */
  get length(): number {
    return Math.max(0, Math.ceil((this.#stop - this.#start) / this.#step));
  }
}
