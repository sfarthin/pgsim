import { Rule, Expected, ResultType, combineBlocks } from "./util";
import { expectedReducer } from "./expectedReducer";
import { Block } from "~/format/util";

export function sequence<A, B>(rules: [Rule<A>, Rule<B>]): Rule<[A, B]>;
export function sequence<A, B, C>(
  rules: [Rule<A>, Rule<B>, Rule<C>]
): Rule<[A, B, C]>;
export function sequence<A, B, C, D>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]
): Rule<[A, B, C, D]>;
export function sequence<A, B, C, D, E>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>]
): Rule<[A, B, C, D, E]>;
export function sequence<A, B, C, D, E, F>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>]
): Rule<[A, B, C, D, E, F]>;
export function sequence<A, B, C, D, E, F, G>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>, Rule<G>]
): Rule<[A, B, C, D, E, F, G]>;
export function sequence<A, B, C, D, E, F, G, H>(
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
): Rule<[A, B, C, D, E, F, G, H]>;
export function sequence<A, B, C, D, E, F, G, H, I>(
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
): Rule<[A, B, C, D, E, F, G, H, I]>;
export function sequence<A, B, C, D, E, F, G, H, I, J>(
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
): Rule<[A, B, C, D, E, F, G, H, I, J]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K>(
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
): Rule<[A, B, C, D, E, F, G, H, I, J, K]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L>(
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
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M>(
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
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
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
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
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
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
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
    Rule<O>,
    Rule<P>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R]>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S]>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T]>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>,
    Rule<U>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U]>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>,
    Rule<U>,
    Rule<V>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V]>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>,
    Rule<U>,
    Rule<V>,
    Rule<W>
  ]
): Rule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W]>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>,
    Rule<U>,
    Rule<V>,
    Rule<W>,
    Rule<X>
  ]
): Rule<
  [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X]
>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>,
    Rule<U>,
    Rule<V>,
    Rule<W>,
    Rule<X>,
    Rule<Y>
  ]
): Rule<
  [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y]
>;
export function sequence<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z
>(
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
    Rule<O>,
    Rule<P>,
    Rule<Q>,
    Rule<R>,
    Rule<S>,
    Rule<T>,
    Rule<U>,
    Rule<V>,
    Rule<W>,
    Rule<X>,
    Rule<Y>,
    Rule<Z>
  ]
): Rule<
  [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z]
>;
export function sequence(rules: Rule<any>[]): Rule<any> {
  const _sequence: Rule<any> = (ctx) => {
    let pos = ctx.pos;
    let length = 0;
    const values = [];

    let tokens: Block | undefined = [];
    let loc: [number, number] = [ctx.pos, ctx.pos];
    let expected: Expected[] = [];

    for (const rule of rules) {
      const prevPos = ctx.pos;
      ctx.pos = pos;
      const result = rule(ctx);
      ctx.pos = prevPos;

      if (ctx.includeExpectedAndTokens) {
        expected = expected
          .concat(
            (result.expected ?? []).map((e) => ({
              ...e,
              tokens: combineBlocks(tokens, e.tokens),
            }))
          )
          .reduce(expectedReducer, []);
      }

      if (result.type === ResultType.Fail) {
        return {
          ...result,
          expected,
        };
      }

      if (ctx.includeExpectedAndTokens) {
        tokens = combineBlocks(tokens ?? [], result?.tokens ?? []);
      }

      loc = [loc[0], result.loc[1]];

      const resultLength = result.loc[1] - result.loc[0];
      pos = pos + resultLength;
      length = length + resultLength;
      values.push(result.value);
    }

    return {
      type: ResultType.Success,
      value: values,
      loc: [ctx.pos, ctx.pos + length],
      ...(ctx.includeExpectedAndTokens ? { expected, tokens } : {}),
    };
  };

  return _sequence;
}
