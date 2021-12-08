import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { Range } from "./range.ts";
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

Deno.test("NaN", async (t) => {
  await t.step("includes", () => {
    const actual = Range.from(10).includes(NaN);
    assertStrictEquals(actual, false);
  });

  await t.step("at", () => {
    const actual = Range.from(10).at(NaN);
    assertStrictEquals(actual, undefined);
  });
});

for (
  const [start, stop, step] of permutationsWithReplacement(SAFE_PARAMETERS, 3)
) {
  const range = Range.from(start, stop, step);
  const expected = rangeEquivalent(start, stop, step);
  const name = `Range(${start}, ${stop}, ${step})`;

  Deno.test(name, async (t) => {
    await t.step("arrays", () => {
      const actual = [...range];
      assertEquals(actual, expected);
    });

    await t.step("reverse", () => {
      const reverseActual = [...range.reverse()];
      const reverseExpected = [...expected].reverse();
      assertEquals(reverseActual, reverseExpected);
    });

    await t.step("length", () => {
      const actualLength = range.length;
      const expectedLength = expected.length;
      assertStrictEquals(actualLength, expectedLength);
    });

    await t.step("includes", async (t) => {
      for (const element of severalElements(start, stop, step)) {
        await t.step(element.toString(), () => {
          const actualIncludes = range.includes(element);
          const expectedIncludes = expected.includes(element);
          assertStrictEquals(actualIncludes, expectedIncludes);
        });
      }
    });

    await t.step("at", async (t) => {
      for (const index of severalIndices(start, stop, step)) {
        await t.step(index.toString(), () => {
          const actualAt = range.at(index);
          const expectedAt = expected.at(index);
          assertStrictEquals(actualAt, expectedAt);
        });
      }
    });

    await t.step("indexOf", async (t) => {
      for (const element of severalIndices(start, stop, step)) {
        await t.step(element.toString(), () => {
          const actualIndexOf = range.indexOf(element);
          const expectedIndexOf = expected.indexOf(element);
          assertStrictEquals(actualIndexOf, expectedIndexOf);
        });
      }
    });

    await t.step("to string", () => {
      const actualToString = range.toString();
      const expectedToString = name;
      assertStrictEquals(actualToString, expectedToString);
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
    for (let value = start; value < stop; value += step) {
      ret.push(value);
    }
    return ret;
  }

  throw new Error("Unreachable");
}

function severalElements(start: number, stop: number, step: number) {
  return [
    start - step,
    start - 7,
    start,
    start + 8,
    start + step,
    stop - 8,
    stop - step,
    stop,
    stop + 8,
    stop + step,
  ];
}

function severalIndices(start: number, stop: number, step: number) {
  const length = Math.ceil((stop - start) / step);
  return [
    -868,
    -length,
    -Math.floor(length / 2),
    -1,
    0,
    1,
    Math.floor((length) / 2),
    length - 1,
    337,
  ];
}
