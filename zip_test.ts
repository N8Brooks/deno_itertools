import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.110.0/testing/asserts.ts";

import { zip } from "./zip.ts";

Deno.test("no iterables", () => {
  const actual = [...zip()];
  assertEquals(actual, []);
});

Deno.test("one iterable", () => {
  const actual = [...zip("abc")];
  assertEquals(actual, [["a"], ["b"], ["c"]]);
});

Deno.test("iterables of different lengths", () => {
  const actual = [...zip("abcde", [1, 2])];
  assertEquals(actual, [["a", 1], ["b", 2]]);
});

Deno.test("larger inputs", () => {
  const a = "a".repeat(100);
  const iterables = Array(5).fill(a);
  let i = 0;
  for (const outputs of zip(...iterables)) {
    assertEquals(outputs, ["a", "a", "a", "a", "a"]);
    i++;
  }
  assertStrictEquals(i, 100);
});

Deno.test("iterator", () => {
  const it = zip("abc");
  const one = it.next().value;
  assertEquals(one, ["a"]);
  const rest = [...it];
  assertEquals(rest, [["b"], ["c"]]);
});

Deno.test("done", () => {
  const it = zip([1, 2, 3]);
  const actual = [...it];
  assertEquals(actual, [[1], [2], [3]]);
  assertEquals(it.next(), { done: true, value: undefined });
  assertEquals(it.next(), { done: true, value: undefined });
  assertEquals(it.next(), { done: true, value: undefined });
});
