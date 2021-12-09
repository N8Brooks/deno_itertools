/** `IterableIterator` that yields aggregated elements from each iterable */
export function zip<T extends unknown[]>(
  ...iterables: { [K in keyof T]: Iterable<T[K]> }
): IterableIterator<T> {
  /** Aggregates the next yielded `value` or `undefined` if `done` */
  const getNextValue = (): T | undefined => {
    const elements = Array(iterators.length);
    for (let i = 0; i < iterators.length; i++) {
      const { value, done } = iterators[i].next();
      if (done) {
        return;
      } else {
        elements[i] = value;
      }
    }
    return elements as T;
  };

  const iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
  let nextValue = iterators.length ? getNextValue() : undefined;

  return {
    next: (): IteratorResult<T> => {
      const value = nextValue;
      if (value) {
        nextValue = getNextValue();
        return { value };
      } else {
        return { done: true, value };
      }
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}
