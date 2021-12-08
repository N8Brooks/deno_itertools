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

  constructor(start: number, stop: number, step: number) {
    if (step === 0) {
      throw new RangeError("Range `step` may not be `0`");
    }
    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(stop) ||
      !Number.isSafeInteger(step)
    ) {
      throw new RangeError("Range parameters must be safe integers");
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

  /** Iterate the described range */
  [Symbol.iterator](): IterableIterator<number> {
    const start = this.#start;
    const sentinel = this.#sentinel;
    const step = this.#step;
    let value = this.#sign === 0 ? sentinel : start - step;
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

  /** Returns the `Range` reversed out-of-place */
  reverse(): Range {
    const start = this.#sentinel;
    const stop = this.#start - this.#step;
    const step = -this.#step;
    return new Range(start, stop, step);
  }

  /** A prior value to `#stop` that is congruent to `#start` mod `#step` */
  get #sentinel(): number {
    return this.#stop + mod(this.#start - this.#stop, this.#step) - this.#step;
  }

  /** Whether the range is ascending = `1`, descending = `-1`, or empty = `-0 | 0` */
  get #sign(): number {
    const sign = Math.sign(this.#stop - this.#start);
    return sign === Math.sign(this.#step) ? sign : 0;
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
        throw new Error("Unreachable");
    }
  }

  /** Is the given element congruent to `#start` modulo `#step` */
  #isCongruent(element: number): boolean {
    // Modulus or remainder is irrelevant since `0 === -0`
    return (this.#start - element) % this.#step === 0;
  }

  /** Returns the `n`th element of the sequence or `undefined` */
  at(n: number): number | undefined {
    if (!Number.isSafeInteger(n)) {
      return undefined;
    }
    const index = n < 0 ? n + this.length : n;
    const element = this.#start + this.#step * index;
    return this.#isContained(element) ? element : undefined;
  }

  /** Returns the index of the element or `-1` if it does not exist */
  indexOf(element: number): number {
    return this.includes(element) ? (element - this.#start) / this.#step : -1;
  }

  /** Returns a shallow copy of the `Range` */
  slice(_start?: number, _stop?: number): Range {
    throw new Error("Unimplemented");
  }

  /** Represented `Range` as a string */
  toString(): string {
    return `Range(${this.#start}, ${this.#stop}, ${this.#step})`;
  }
}
