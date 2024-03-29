import { Rule, Context, Expected, ResultType } from "./util";
import { expectedReducer } from "./expectedReducer";

export function or<A>(rules: [Rule<A>]): Rule<A>;
export function or<A, B>(rules: [Rule<A>, Rule<B>]): Rule<A | B>;
export function or<A, B, C>(
  rules: [Rule<A>, Rule<B>, Rule<C>]
): Rule<A | B | C>;
export function or<A, B, C, D>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]
): Rule<A | B | C | D>;
export function or<A, B, C, D, E>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>]
): Rule<A | B | C | D | E>;
export function or<A, B, C, D, E, F>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>]
): Rule<A | B | C | D | E | F>;
export function or<A, B, C, D, E, F, G>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>, Rule<G>]
): Rule<A | B | C | D | E | F | G>;
export function or<A, B, C, D, E, F, G, H>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>
  ]
): Rule<A | B | C | D | E | F | G | H>;
export function or<A, B, C, D, E, F, G, H, I>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>
  ]
): Rule<A | B | C | D | E | F | G | H | I>;
export function or<A, B, C, D, E, F, G, H, I, J>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>,
    Rule<J>
  ]
): Rule<A | B | C | D | E | F | G | H | I | J>;
export function or<A, B, C, D, E, F, G, H, I, J, K>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>,
    Rule<J>,
    Rule<K>
  ]
): Rule<A | B | C | D | E | F | G | H | I | J | K>;
export function or<A, B, C, D, E, F, G, H, I, J, K, L>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>,
    Rule<J>,
    Rule<K>,
    Rule<L>
  ]
): Rule<A | B | C | D | E | F | G | H | I | J | K | L>;
export function or<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>,
    Rule<J>,
    Rule<K>,
    Rule<L>,
    Rule<M>
  ]
): Rule<A | B | C | D | E | F | G | H | I | J | K | L | M>;
export function or<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>,
    Rule<J>,
    Rule<K>,
    Rule<L>,
    Rule<M>,
    Rule<N>
  ]
): Rule<A | B | C | D | E | F | G | H | I | J | K | L | M | N>;

export function or<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  rules: [
    Rule<A>,
    Rule<B>,
    Rule<C>,
    Rule<D>,
    Rule<E>,
    Rule<F>,
    Rule<G>,
    Rule<H>,
    Rule<I>,
    Rule<J>,
    Rule<K>,
    Rule<L>,
    Rule<M>,
    Rule<N>,
    Rule<O>
  ]
): Rule<A | B | C | D | E | F | G | H | I | J | K | L | M | N | O>;

export function or(rules: Rule<any>[]): Rule<any> {
  const _or: Rule<any> = (ctx: Context) => {
    const results = rules.map((r) => r(ctx));

    const firstMatch = results.find((r) => {
      return r.type === ResultType.Success;
    });

    const expected = ctx.includeExpected
      ? results
          .reduce((acc, r) => acc.concat(r.expected ?? []), [] as Expected[])
          .reduce(expectedReducer, [])
      : undefined;

    if (firstMatch) {
      return { ...firstMatch, expected };
    }

    return {
      ...results[0],
      type: ResultType.Fail,
      expected,
      pos:
        expected?.[0]?.pos ?? // <-- these should all be the same.
        ctx.pos, // <-- incase we have no expected results (wierd case),
    };
  };
  return _or;
}
