import {
  Rule,
  BufferRule,
  EitherRule,
  Expected,
  ResultType,
  combineBlocks,
} from "./util";
import { expectedReducer } from "./expectedReducer";
import { Block } from "~/format/util";

export function sequence<A, B>(
  rules: [BufferRule<A>, BufferRule<B>]
): BufferRule<[A, B]>;
export function sequence<A, B, C>(
  rules: [BufferRule<A>, BufferRule<B>, BufferRule<C>]
): BufferRule<[A, B, C]>;
export function sequence<A, B, C, D>(
  rules: [BufferRule<A>, BufferRule<B>, BufferRule<C>, BufferRule<D>]
): BufferRule<[A, B, C, D]>;
export function sequence<A, B, C, D, E>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>
  ]
): BufferRule<[A, B, C, D, E]>;
export function sequence<A, B, C, D, E, F>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>
  ]
): BufferRule<[A, B, C, D, E, F]>;
export function sequence<A, B, C, D, E, F, G>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>
  ]
): BufferRule<[A, B, C, D, E, F, G]>;
export function sequence<A, B, C, D, E, F, G, H>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>
  ]
): BufferRule<[A, B, C, D, E, F, G, H]>;
export function sequence<A, B, C, D, E, F, G, H, I>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I]>;
export function sequence<A, B, C, D, E, F, G, H, I, J>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q]>;
export function sequence<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R]>;
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
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S]>;
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
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T]>;
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
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>,
    BufferRule<U>
  ]
): BufferRule<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U]>;
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
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>,
    BufferRule<U>,
    BufferRule<V>
  ]
): BufferRule<
  [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V]
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
  W
>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>,
    BufferRule<U>,
    BufferRule<V>,
    BufferRule<W>
  ]
): BufferRule<
  [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W]
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
  X
>(
  rules: [
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>,
    BufferRule<U>,
    BufferRule<V>,
    BufferRule<W>,
    BufferRule<X>
  ]
): BufferRule<
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
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>,
    BufferRule<U>,
    BufferRule<V>,
    BufferRule<W>,
    BufferRule<X>,
    BufferRule<Y>
  ]
): BufferRule<
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
    BufferRule<A>,
    BufferRule<B>,
    BufferRule<C>,
    BufferRule<D>,
    BufferRule<E>,
    BufferRule<F>,
    BufferRule<G>,
    BufferRule<H>,
    BufferRule<I>,
    BufferRule<J>,
    BufferRule<K>,
    BufferRule<L>,
    BufferRule<M>,
    BufferRule<N>,
    BufferRule<O>,
    BufferRule<P>,
    BufferRule<Q>,
    BufferRule<R>,
    BufferRule<S>,
    BufferRule<T>,
    BufferRule<U>,
    BufferRule<V>,
    BufferRule<W>,
    BufferRule<X>,
    BufferRule<Y>,
    BufferRule<Z>
  ]
): BufferRule<
  [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z]
>;
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
export function sequence(rules: EitherRule<any>[]): EitherRule<any> {
  const newBufferRule: EitherRule<any> = (ctx) => {
    let pos = ctx.pos;
    let length = 0;
    const values = [];

    let tokens: Block = [];
    let buffer = "";
    let mode: "tokens" | "buffer" | null = null;
    let expected: Expected[] = [];

    for (const rule of rules) {
      const result = rule({ ...ctx, pos });

      expected = expected
        .concat(
          result.expected.map((e) => ({
            ...e,
            tokens: combineBlocks(tokens, e.tokens),
          }))
        )
        .reduce(expectedReducer, []);

      if (result.type === ResultType.Fail) {
        return {
          ...result,
          expected,
        };
      }

      if ("tokens" in result) {
        if (mode && mode === "buffer") {
          throw new Error("Buffer and Node mishap");
        }
        mode = "tokens";
        tokens = combineBlocks(tokens, result.tokens);
      } else if ("buffer" in result && result.buffer !== "") {
        if (mode && mode === "tokens") {
          throw new Error("Buffer and Node mishap");
        }
        mode = "buffer";
        buffer = `${buffer}${result.buffer}`;
      }

      pos = pos + result.length;
      length = length + result.length;
      values.push(result.value);
    }

    return {
      type: ResultType.Success,
      expected,
      value: values,
      length,
      pos,
      ...(mode !== "buffer" ? { tokens } : { buffer }),
    };
  };

  return newBufferRule;
}
