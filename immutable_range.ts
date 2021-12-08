/** JavaScript equivalent of modulo operation */
const mod = (dividend: number, divisor: number): number => {
  return ((dividend % divisor) + divisor) % divisor;
};

/** Represents a range of integers */
export class Range {
  /** Starting value for the sequence */
  readonly #start: number;

  /** No values are yielded equal to or beyond this */
  readonly #stop: number;

  /** The amount added to `#value` per iteration */
  readonly #step: number;

  /** Whether the range is ascending, descending, or empty */
  readonly #sign: number;

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
    const sign = Math.sign(stop - start);
    this.#sign = sign === Math.sign(step) ? sign : 0;
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

  /** Iterate the described range */
  *[Symbol.iterator](): Generator<number> {
    // Based on cpython implementation
    if (this.length === 0) {
      return;
    }
    let value = this.#start;
    const sentinel = this.#sentinel;
    while (value !== sentinel) {
      yield value;
      value += this.#step;
    }
  }

  /** Returns the `Range` reversed out-of-place */
  reverse(): Range {
    const start = this.#sentinel - this.#step;
    const stop = this.#start - this.#step;
    const step = -this.#step;
    return new Range(start, stop, step);
  }

  /** First element outside of the `Range` that is congruent to `#start` modulo `#step` */
  get #sentinel(): number {
    return this.#stop + mod(this.#start - this.#stop, this.#step);
  }

  /** The number of elements in the `Range` */
  get length(): number {
    return Math.max(0, Math.ceil((this.#stop - this.#start) / this.#step));
  }

  /** Determines whether the `Range` includes a certain value */
  includes(element: number): boolean {
    return this.#isContained(element) && this.#isCongruent(element);
  }

  /** Element is between the given range */
  #isContained(element: number): boolean {
    switch (this.#sign) {
      case -1:
        return this.#stop < element && element <= this.#start;
      case 0:
        return false;
      case 1:
        return this.#start <= element && element < this.#stop;
      default:
        throw new Error("Unreachable: sign is not `-1`, `0`, or `1`");
    }
  }

  /** Is the given element congruent to `#start` modulo `#step` */
  #isCongruent(element: number): boolean {
    // Modulus or remainder is irrelevant since `0 === -0`
    return (this.#start - element) % this.#step === 0;
  }

  /** Represented `Range` as a string */
  toString(): string {
    return `Range(${this.#start}, ${this.#stop}, ${this.#step})`;
  }
}
