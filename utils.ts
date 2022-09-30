import { Result } from "./results.ts";
// deno-lint-ignore no-unused-vars
import { ErrContainer, OkContainer } from "./types.ts";

/** Wrap code that may throw errors in a container.
 *
 * ```ts
 * import { unsafe } from "https://deno.land/x/result_js@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const result = unsafe(() => {
 *   throw Error("Dangerous!!");
 * });
 * assertEquals(result.value, Error());
 * assertEquals(result.type, "err");
 * ```
 */
export function unsafe<T, E>(
  fn: () => T,
): Result<T, E> {
  try {
    return Result.ok(fn());
  } catch (e) {
    return Result.err<E>(e);
  }
}

/** Matching patterns. */
export interface Patterns<T, E, U> {
  /** Match if the result is {@link OkContainer}. */
  ok: (value: T) => U;

  /** Match if the result is {@link ErrContainer}. */
  err: (value: E) => U;
}

/** Pattern matching for {@link Result}.
 *
 * ```ts
 * import { match, Result } from "https://deno.land/x/result_js@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * const value = match(Result.ok("Tom"), {
 *   ok: (value) => "Hello " + value,
 *   err: (value) => "Goodby " + value,
 * });
 * assertEquals(value, "Hello Tom");
 * ```
 */
export function match<T, E, U>(
  result: Result<T, E>,
  patterns: Patterns<T, E, U>,
): U {
  return result.type === "ok"
    ? patterns.ok(result.value)
    : patterns.err(result.value);
}