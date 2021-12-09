import {
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { Range } from "./range.ts";

Deno.test("constructor", async (t) => {
  await t.step("step of 0", () => {
    assertThrows(() => new Range(0, 10, 0));
  });

  await t.step("unsafe start", () => {
    assertThrows(() => new Range(NaN, 10, 1));
  });

  await t.step("unsafe stop", () => {
    assertThrows(() => new Range(0, Infinity, 1));
  });

  await t.step("unsafe step", () => {
    assertThrows(() => new Range(0, 10, Math.PI));
  });
});

Deno.test("from", async (t) => {
  await t.step("one parameter", () => {
    assertEquals([...Range.from(3)], [0, 1, 2]);
  });

  await t.step("two parameters", () => {
    assertEquals([...Range.from(1, 4)], [1, 2, 3]);
  });

  await t.step("three parameters", () => {
    assertEquals([...Range.from(1, 5, 2)], [1, 3]);
  });
});

Deno.test("range[Symbol.iterator]", async (t) => {
  await t.step("ascending congruent stop", () => {
    assertEquals([...Range.from(1, 5, 2)], [1, 3]);
  });

  await t.step("ascending incongruent stop", () => {
    assertEquals([...Range.from(1, 6, 2)], [1, 3, 5]);
  });

  await t.step("descending congruent stop", () => {
    assertEquals([...Range.from(0, -3, -1)], [0, -1, -2]);
  });

  await t.step("descending incongruent stop", () => {
    assertEquals([...Range.from(0, -5, -2)], [0, -2, -4]);
  });

  await t.step("sign of 0 from reversed start and stop", () => {
    assertEquals([...Range.from(0, 10, -1)], []);
  });

  await t.step("sign of 0 from same start and stop", () => {
    assertEquals([...Range.from(0, 0, 1)], []);
  });

  await t.step("[Symbol.iterator]", () => {
    const it = Range.from(3)[Symbol.iterator]();
    assertEquals([...it], [0, 1, 2]);
    assertEquals(it.next(), { value: undefined, done: true });
    assertEquals(it.next(), { value: undefined, done: true });
    assertEquals(it.next(), { value: undefined, done: true });
  });
});

Deno.test("reverse", async (t) => {
  await t.step("ascending", () => {
    assertEquals([...Range.from(3).reverse()], [2, 1, 0]);
  });

  await t.step("empty start equals stop", () => {
    assertEquals([...Range.from(0).reverse()], []);
  });

  await t.step("empty start greater than stop", () => {
    assertEquals([...Range.from(10, 5).reverse()], []);
  });

  await t.step("descending", () => {
    assertEquals([...Range.from(7, 3, -2).reverse()], [5, 7]);
  });
});

Deno.test("length", async (t) => {
  await t.step("max of 0", () => {
    assertStrictEquals(Range.from(10, 0).length, 0);
  });
  await t.step("max of 0 descending", () => {
    assertStrictEquals(Range.from(0, 10, -1).length, 0);
  });

  await t.step("minimum of 1 if there is a step", () => {
    assertStrictEquals(Range.from(0, 1, 100).length, 1);
  });

  await t.step("minimum of 1 if there is a descending step", () => {
    assertStrictEquals(Range.from(0, -1, -100).length, 1);
  });

  await t.step("start equals stop", () => {
    assertStrictEquals(Range.from(0).length, 0);
  });

  await t.step("step of 1", () => {
    assertStrictEquals(Range.from(10).length, 10);
  });

  await t.step("ceil operation", () => {
    assertStrictEquals(Range.from(0, 10, 3).length, 4);
  });

  await t.step("descending step of 1", () => {
    assertStrictEquals(Range.from(0, -10, -1).length, 10);
  });

  await t.step("descending with ceil operation", () => {
    assertStrictEquals(Range.from(0, -10, -4).length, 3);
  });
});

Deno.test("includes", async (t) => {
  await t.step("#isContained", async (t) => {
    await t.step("descending not contained by stop", () => {
      assertStrictEquals(Range.from(10, 0, -1).includes(0), false);
    });

    await t.step("descending contained by stop", () => {
      assertStrictEquals(Range.from(10, 0, -1).includes(1), true);
    });

    await t.step("descending contained by start", () => {
      assertStrictEquals(Range.from(10, 0, -1).includes(10), true);
    });

    await t.step("descending not contained by start", () => {
      assertStrictEquals(Range.from(10, 0, -1).includes(11), false);
    });

    await t.step("empty", () => {
      assertStrictEquals(Range.from(0).includes(0), false);
    });

    await t.step("ascending not contained by start", () => {
      assertStrictEquals(Range.from(10).includes(-1), false);
    });

    await t.step("ascending contained by start", () => {
      assertStrictEquals(Range.from(10).includes(0), true);
    });

    await t.step("ascending contained by stop", () => {
      assertStrictEquals(Range.from(10).includes(9), true);
    });

    await t.step("ascending not contained by stop", () => {
      assertStrictEquals(Range.from(10).includes(10), false);
    });
  });

  await t.step("#isCongruent", async (t) => {
    await t.step("is congruent descending", () => {
      assertStrictEquals(Range.from(10, 0, -2).includes(8), true);
    });

    await t.step("is not congruent descending", () => {
      assertStrictEquals(Range.from(10, 0, -2).includes(7), false);
    });

    await t.step("is congruent empty", () => {
      assertStrictEquals(Range.from(10, 0, 2).includes(8), false);
    });

    await t.step("is not congruent empty", () => {
      assertStrictEquals(Range.from(10, 0, 2).includes(7), false);
    });

    await t.step("is congruent ascending", () => {
      assertStrictEquals(Range.from(0, 10, 3).includes(3), true);
    });

    await t.step("is not congruent ascending", () => {
      assertStrictEquals(Range.from(0, 10, 3).includes(5), false);
    });
  });
});

Deno.test("at", async (t) => {
  await t.step("-start", () => {
    assertStrictEquals(Range.from(10).at(-10), 0);
  });

  await t.step("-middle", () => {
    assertStrictEquals(Range.from(10).at(-5), 5);
  });

  await t.step("-stop", () => {
    assertStrictEquals(Range.from(10).at(-1), 9);
  });

  await t.step("start", () => {
    assertStrictEquals(Range.from(10).at(0), 0);
  });

  await t.step("middle", () => {
    assertStrictEquals(Range.from(10).at(5), 5);
  });

  await t.step("stop", () => {
    assertStrictEquals(Range.from(10).at(9), 9);
  });

  await t.step("not included", () => {
    assertStrictEquals(Range.from(10).at(100), undefined);
  });
});

Deno.test("indexOf", async (t) => {
  await t.step("start", () => {
    assertStrictEquals(Range.from(10, 20, 3).indexOf(10), 0);
  });

  await t.step("middle", () => {
    assertStrictEquals(Range.from(5, 11, 2).indexOf(7), 1);
  });

  await t.step("stop", () => {
    assertStrictEquals(Range.from(0, 13, 3).indexOf(9), 3);
  });

  await t.step("not included", () => {
    assertStrictEquals(Range.from(10).indexOf(-100), -1);
  });
});

Deno.test("slice", async (t) => {
  await t.step("defaults", async (t) => {
    await t.step("no parameters", () => {
      assertEquals([...Range.from(3).slice()], [0, 1, 2]);
    });

    await t.step("one parameter", () => {
      assertEquals([...Range.from(3).slice(1)], [1, 2]);
    });

    await t.step("both parameters", () => {
      assertEquals([...Range.from(3).slice(1, 2)], [1]);
    });
  });

  await t.step("i", async (t) => {
    await t.step("not a number", () => {
      assertEquals([...Range.from(10).slice(NaN)], []);
    });

    await t.step("trunc", () => {
      assertEquals([...Range.from(5).slice(3.5)], [3, 4]);
    });

    await t.step("negative start", () => {
      assertEquals([...Range.from(4).slice(-4)], [0, 1, 2, 3]);
    });

    await t.step("negative middle", () => {
      assertEquals([...Range.from(4).slice(-2)], [2, 3]);
    });

    await t.step("negative stop", () => {
      assertEquals([...Range.from(4).slice(-1)], [3]);
    });

    await t.step("positive start", () => {
      assertEquals([...Range.from(4).slice(0)], [0, 1, 2, 3]);
    });

    await t.step("positive middle", () => {
      assertEquals([...Range.from(4).slice(2)], [2, 3]);
    });

    await t.step("positive stop", () => {
      assertEquals([...Range.from(4).slice(3)], [3]);
    });

    await t.step("min", () => {
      assertEquals([...Range.from(4).slice(10)], []);
    });

    await t.step("max", () => {
      assertEquals([...Range.from(4).slice(-10)], [0, 1, 2, 3]);
    });
  });

  await t.step("j", async (t) => {
    await t.step("not a number", () => {
      assertEquals([...Range.from(10).slice(0, NaN)], []);
    });

    await t.step("trunc", () => {
      assertEquals([...Range.from(5).slice(0, 3.5)], [0, 1, 2]);
    });

    await t.step("negative start", () => {
      assertEquals([...Range.from(4).slice(0, -4)], []);
    });

    await t.step("negative middle", () => {
      assertEquals([...Range.from(4).slice(0, -2)], [0, 1]);
    });

    await t.step("negative stop", () => {
      assertEquals([...Range.from(4).slice(0, -1)], [0, 1, 2]);
    });

    await t.step("positive start", () => {
      assertEquals([...Range.from(4).slice(0, 0)], []);
    });

    await t.step("positive middle", () => {
      assertEquals([...Range.from(4).slice(0, 2)], [0, 1]);
    });

    await t.step("positive stop", () => {
      assertEquals([...Range.from(4).slice(0, 3)], [0, 1, 2]);
    });

    await t.step("min", () => {
      assertEquals([...Range.from(4).slice(0, 10)], [0, 1, 2, 3]);
    });

    await t.step("max", () => {
      assertEquals([...Range.from(4).slice(0, -10)], []);
    });
  });
});

Deno.test("toString", () => {
  assertStrictEquals(Range.from(10).toString(), "Range(0, 10, 1)");
});

Deno.test("valueOf", () => {
  assertStrictEquals(Range.from(10, 5, -1).valueOf(), "Range(10, 5, -1)");
});
