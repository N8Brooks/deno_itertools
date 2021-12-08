import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { Range } from "./mutable_range.ts";

const SAFE_PARAMETERS = [
  -90,
  -10,
  -1,
  1,
  8,
  99,
];

Deno.test("non-safe start", () => {
  assertThrows(() => new Range(Math.PI, 10, 1));
});

Deno.test("non-safe stop", () => {
  assertThrows(() => new Range(0, Infinity, 1));
});

Deno.test("non-safe step", () => {
  assertThrows(() => new Range(0, 10, NaN));
});

Deno.test("safe start", () => {
  const actual = [...Range.from(10)];
  const expected = Array.from({ length: 10 }, (_, i) => i);
  assertEquals(actual, expected);
});

Deno.test("safe stop", () => {
  const actual = [...Range.from(5, 10)];
  const expected = Array.from({ length: 5 }, (_, i) => 5 + i);
  assertEquals(actual, expected);
});

Deno.test("safe step", () => {
  const actual = [...Range.from(1, 10, 3)];
  const expected = [1, 4, 7];
  assertEquals(actual, expected);
});
