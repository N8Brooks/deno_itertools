import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { Range } from "./immutable_range.ts";
import { permutationsWithReplacement } from "https://deno.land/x/combinatorics@1.0.1/permutations_with_replacement.ts";

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

for (
  const [start, stop, step] of permutationsWithReplacement(SAFE_PARAMETERS, 3)
) {
  const range = Range.from(start, stop, step);
  const expected = rangeEquivalent(start, stop, step);
  const name = `Range(${start}, ${stop}, ${step})`;

  Deno.test(name, async (t) => {
    await t.step("arrays", () => {
      assertEquals([...range], expected);
    });

    await t.step("to string", () => {
      assertStrictEquals(range.toString(), name);
    });
  });
}

function rangeEquivalent(start: number, stop: number, step: number): number[] {
  const sign = Math.sign(stop - start);

  if (sign !== Math.sign(step)) {
    return [];
  }

  if (sign === -1) {
    const ret = [];
    for (let value = start; value > stop; value += step) {
      ret.push(value);
    }
    return ret;
  }

  if (sign === 1) {
    const ret = [];
    console.log(start, stop, step);
    for (let value = start; value < stop; value += step) {
      ret.push(value);
    }
    return ret;
  }

  throw new Error("Unreachable");
}
