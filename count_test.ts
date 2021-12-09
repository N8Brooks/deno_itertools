import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.110.0/testing/asserts.ts";
import { count } from "./count.ts";

Deno.test("non finite start", () => {
  assertThrows(() => count(NaN));
});

Deno.test("non finite step", () => {
  assertThrows(() => count(0, Infinity));
});

Deno.test("ascending", () => {
  const it = count();
  assertEquals(it.next(), { value: 0 });
  assertEquals(it.next(), { value: 1 });
  assertEquals(it.next(), { value: 2 });
  assertEquals(it.next(), { value: 3 });
});

Deno.test("descending", () => {
  const it = count(10, -5);
  assertEquals(it.next(), { value: 10 });
  assertEquals(it.next(), { value: 5 });
  assertEquals(it.next(), { value: 0 });
  assertEquals(it.next(), { value: -5 });
});

Deno.test("non integers", () => {
  const it = count(0.5, 1.5);
  assertEquals(it.next(), { value: 0.5 });
  assertEquals(it.next(), { value: 2.0 });
  assertEquals(it.next(), { value: 3.5 });
  assertEquals(it.next(), { value: 5.0 });
});

Deno.test("[Symbol.iterator]", () => {
  const it = count()[Symbol.iterator]();
  assertEquals(it.next(), { value: 0 });
  assertEquals(it.next(), { value: 1 });
  assertEquals(it.next(), { value: 2 });
  assertEquals(it.next(), { value: 3 });
});
