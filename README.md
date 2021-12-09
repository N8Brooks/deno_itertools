# deno_itertools

A collection of `IterableIterator` utilities made for Deno. Based on iterator
utilities provided by built-in Python and itertools. If you are interested in
combinatorical iterators for Deno check out
[combinatiorics](https://deno.land/x/combinatorics).

## Usage

### count

Iterates evently spaced numbers indefinitely.

```ts
import { count } from "./count.ts";
count(10, 2); // 10, 12, 14, ...
```

### Range

Provides a sequence of integers as well as helper methods. Similar to Python's
`range` except modified to be more JavaScript friendly.

```ts
import { Range } from "./range.ts";

Range.from(10); // 0, 1, 2, .... 9

Range.from(5, 10); // 5, 6, 7, .... 9

Range.from(5, 100, 2); // 5, 7, 9, ... 98

Range.from(10).length; // 10

Range.from(0, 100, 10).includes(10); // true
```

### Zip

Aggregates elements from each iterable.

```ts
import { zip } from "./zip.ts";

zip("abcdefghi", [1, 2, 3, 5, 6, 7, 8, 9]); // ['a', 1], ['b', 2], ['c', 3], ..., ['i', 9]
```

Can also be used to calculate a transpose of a matrix.

```ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { zip } from "./zip.ts";

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [8, 9, 10],
];

const transpose = [...zip(...matrix)];

assertEquals(transpose, [
  [1, 4, 8],
  [2, 5, 9],
  [3, 6, 10],
]);
```
