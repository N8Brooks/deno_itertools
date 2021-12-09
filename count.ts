/** `IterableIterator` that yields evenly spaced numbers. */
export function count(start = 0, step = 1): IterableIterator<number> {
  if (!Number.isFinite(start) || !Number.isFinite(step)) {
    throw new Error("Count parameters must be finite");
  }
  let value = start - step;
  return {
    next: (): IteratorResult<number> => {
      return { value: value += step };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}
