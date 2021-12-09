# deno_itertools

A collection of `IterableIterator` utilities made for Deno. Based on iterator
utilities provided by built-in Python and itertools. If you are interested in
combinatorical iterators for Deno check out
[combinatiorics](https://deno.land/x/combinatorics).

## Usage

### Count

Iterates evently spaced numbers indefinitely.

```ts
count(10, 2); // 10, 12, 14, ...
```

### Range

Provides a sequence of integers as well as helper methods. Similar to Python's
`range` except modified to be more JavaScript friendly.

```ts
Range.from(10); // 0, 1, 2, .... 9
```

```ts
Range.from(5, 10); // 5, 6, 7, .... 9
```

```ts
Range.from(5, 100, 2); // 5, 7, 9, ... 98
```

```ts
Range.from(10).length; // 10
```

```ts
Range.from(0, 100, 10).includes(10); // true
```

### Zip

Aggregates elements from each iterable.

```ts
zip("abcdefghi", [1, 2, 3, 5, 6, 7, 8, 9]); // ['a', 1], ['b', 2], ['c', 3], ..., ['i', 9]
```
