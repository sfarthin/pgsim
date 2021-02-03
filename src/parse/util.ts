/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Types
 */

export enum ResultType {
  Fail = "___FAIL___",
  Success = "___SUCCESS___",
}

type Expected =
  | { type: "keyword"; value: string; pos: number }
  | { type: "notKeyword"; value: string; pos: number }
  | { type: "regex"; value: string; pos: number }
  | { type: "identifier"; value: string; pos: number }
  | { type: "endOfInput"; value: string; pos: number };

export type SuccessResult<R> = {
  type: ResultType.Success;
  value: R;
  length: number;

  // Sometimes we get a successful result but it may fail later and we still need to
  // refer to this expected result
  expected: Expected[];
  pos: number;
};

export type FailResult = {
  type: ResultType.Fail;
  expected: Expected[];
  pos: number;
};

export type RuleResult<R> = FailResult | SuccessResult<R>;

export type Context = {
  // hacky, computed from end endOfStatement rule
  startOfNextStatement: number[];
  endOfStatement: number[];

  str: string;
  pos: number;
};

export type Rule<R> = ((c: Context) => RuleResult<R>) & {
  identifier?: string; // <-- sometimes the constant is better identified by a name (\n -> newline)
  isIdentifier?: true; // <-- Is this a constant or some kind of dynamic identifier
};

const expectedReducer = (acc: Expected[], e: Expected): Expected[] => {
  // If this is the first one use it.
  // If the error is furthor along, then use that one.
  if (!acc[0] || acc[0].pos < e.pos) {
    return [e];
  }

  // If its on the same line just concatenate them.
  // unless its a duplicate
  if (acc[0].pos === e.pos && !acc.some((v) => v.value === e.value)) {
    return acc.concat(e);
  }

  // if r is referes to a previes pos, ignore
  return acc;
};

export const placeholder: Rule<null> = (ctx) => ({
  type: ResultType.Success,
  value: null,
  expected: [],
  length: 0,
  pos: ctx.pos,
});

export const endOfInput: Rule<null> = (ctx) => {
  if (ctx.pos == ctx.str.length) {
    return {
      type: ResultType.Success,
      value: null,
      length: 0, // <-- unlike most rules, this one does not progress the position
      expected: [],
      pos: ctx.pos,
    };
  }

  return {
    type: ResultType.Fail,
    expected: [{ type: "endOfInput", value: "end of input", pos: ctx.pos }],
    pos: ctx.pos,
  };
};

export function constant(
  keyword: string
): Rule<{ start: number; value: string }> {
  const rule: Rule<{ start: number; value: string }> = (ctx: Context) => {
    const potentialKeyword = ctx.str.substring(
      ctx.pos,
      ctx.pos + keyword.length
    );

    if (potentialKeyword.toLowerCase() === keyword.toLowerCase()) {
      return {
        type: ResultType.Success,
        value: { start: ctx.pos, value: keyword },
        length: keyword.length,
        expected: [],
        pos: ctx.pos,
      };
    }

    return {
      type: ResultType.Fail,
      expected: [
        {
          type: "keyword",
          value: rule.identifier ?? `"${keyword}"`,
          pos: ctx.pos,
        },
      ],
      pos: ctx.pos,
    };
  };

  return rule;
}

function regexChar(r: RegExp): Rule<string> {
  if (r.global) {
    throw new Error(
      "Cannot use global match. See https://stackoverflow.com/questions/209732/why-am-i-seeing-inconsistent-javascript-logic-behavior-looping-with-an-alert-v"
    );
  }
  const rule: Rule<string> = ({ str, pos }) => {
    const char = str.charAt(pos);
    if (r.test(char)) {
      return {
        type: ResultType.Success,
        value: char,
        length: 1,
        expected: [],
        pos,
      };
    }
    return {
      type: ResultType.Fail,
      expected: [
        { type: "regex", value: rule.identifier ?? r.toString(), pos },
      ],
      pos,
    };
  };

  return rule;
}

function multiply<T>(
  rule: Rule<T>,
  min: number,
  max: number | null
): Rule<T[]> {
  const newRule: Rule<T[]> = (ctx: Context) => {
    let curr: RuleResult<T>;
    const start = ctx.pos;
    let pos = ctx.pos;
    const values = [];
    let expected: Expected[] = [];
    let lastPos = pos;
    while (pos < ctx.str.length && (max === null || values.length < max)) {
      curr = rule({ ...ctx, pos });
      expected = expected.concat(curr.expected).reduce(expectedReducer, []);
      if (curr.type === ResultType.Success) {
        pos += curr.length;
        values.push(curr.value);
      } else {
        lastPos = curr.pos;
        break;
      }
    }

    if (values.length < min) {
      return {
        type: ResultType.Fail,
        expected,
        pos: lastPos,
      };
    }

    return {
      type: ResultType.Success,
      value: values,
      length: pos - start,
      expected,
      pos: lastPos,
    };
  };

  return newRule;
}

export function zeroToMany<T>(rule: Rule<T>) {
  return multiply(rule, 0, null);
}

export function oneToMany<T, R>(rule: Rule<T>) {
  return multiply(rule, 1, null);
}

export function zeroToOne<T, R>(rule: Rule<T>) {
  return multiply(rule, 0, 1);
}

export function zeroToTen<T, R>(rule: Rule<T>) {
  return multiply(rule, 0, 10);
}

export const whitespace = transform(regexChar(/[ \t\r\n]/), () => null);
export const whitespaceWithoutNewline = regexChar(/[ \t\r]/);

function notConstant(keyword: string): Rule<string> {
  const rule: Rule<string> = (ctx: Context) => {
    const potentialKeyword = ctx.str.substring(
      ctx.pos,
      ctx.pos + keyword.length
    );

    if (potentialKeyword.toLowerCase() !== keyword.toLowerCase()) {
      return {
        type: ResultType.Success,
        value: ctx.str.charAt(ctx.pos),
        expected: [],
        length: 1,
        pos: ctx.pos,
      };
    }

    return {
      type: ResultType.Fail,
      expected: [
        {
          type: "notKeyword",
          value: rule.identifier ?? `not "${keyword}"`,
          pos: ctx.pos,
        },
      ],
      pos: ctx.pos,
    };
  };

  return rule;
}

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
  const newRule: Rule<any> = (ctx) => {
    let pos = ctx.pos;
    let length = 0;
    const values = [];

    let expected: Expected[] = [];

    for (const rule of rules) {
      const result = rule({ ...ctx, pos });

      expected = expected.concat(result.expected).reduce(expectedReducer, []);

      if (result.type === ResultType.Fail) {
        return { ...result, expected };
      }

      pos = pos + result.length;
      length = length + result.length;
      values.push(result.value);
    }

    return {
      type: ResultType.Success,
      value: values,
      length,
      expected,
      pos,
    };
  };

  return newRule;
}

export function transform<T, R>(
  rule: Rule<T>,
  transform: (i: T, c: Context) => R
): Rule<R> {
  const newRule: Rule<R> = (ctx) => {
    const result = rule(ctx);
    if (result.type === ResultType.Success) {
      return {
        ...result,
        value: transform(result.value, ctx),
      };
    }
    return result;
  };

  newRule.identifier = rule.identifier;

  return newRule;
}

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

export function or<T>(rules: Rule<any>[]): Rule<any> {
  return (ctx: Context) => {
    // TODO optomize
    const results = rules.map((r) => r(ctx));

    const firstMatch = results.find((r) => {
      return r.type === ResultType.Success;
    });

    const expected = results
      .reduce((acc, r) => acc.concat(r.expected), [] as Expected[])
      .reduce(expectedReducer, []);

    if (firstMatch) {
      return { ...firstMatch, expected };
    }

    return {
      type: ResultType.Fail,
      expected,
      pos: expected[0].pos,
    };
  };
}

export function finalizeComment(str: string) {
  const lines = str.split("\n");

  const stripAmount = lines.reduce((n, l) => {
    // console.log("--->", l.match(/[^\s]/i)?.index);
    return Math.min(n, l.match(/[^\s\t ]/i)?.index ?? 999999999);
  }, 999999999);
  // console.log(stripAmount);

  if (stripAmount > 0) {
    return lines
      .map((l) => l.substring(stripAmount))
      .join("\n")
      .trim()
      .replace(/\n\s*\n/, "\n");
  }
  return str.trim().replace(/\n\s*\n/, "\n");
}

export function combineComments(...c: (string | null | undefined)[]) {
  return c
    .filter(Boolean)
    .map((s) => s ?? "")
    .join("\n");
  // .replace(/\n\s*\n\s*\n/gi, "\n\n");
  // .replace(/^[\s\n\t ]*\n/, "")
  // .replace(/\n[\s\n\t ]*$/, "");
}

const newline = constant("\n");
newline.identifier = "newline";

const notNewline = notConstant("\n");
notNewline.identifier = "!newline";

export const cStyleComment = transform(
  sequence([
    constant("/*"),
    zeroToMany(notConstant("*/")),
    constant("*/"),
    zeroToOne(newline),
  ]),
  (v) =>
    combineComments(
      v[1]
        .join("")
        .replace(/\n[\s\t ]*\*/gi, "\n")
        .replace(/^[\s\n\t ]*\*/, "")
        .replace(/\n$/, "")
    ).trim() // we can trim individual cStyle comments because they are unlikey to be indented with other comments.
);

export const cStyleCommentWithoutNewline = transform(
  sequence([constant("/*"), zeroToMany(notConstant("*/")), constant("*/")]),
  (v) =>
    combineComments(
      v[1]
        .join("")
        .replace(/\n[\s\t ]*\*/gi, "\n")
        .replace(/^[\s\n\t ]*\*/, "")
        .replace(/\n$/, "")
    ).trim()
);

export const sqlStyleComment = transform(
  sequence([
    constant("--"),
    zeroToOne(whitespace),
    zeroToMany(notNewline),
    or([newline, endOfInput]),
  ]),
  (v) => combineComments(v[2].join(""))
);

export const sqlStyleCommentWithoutNewline = transform(
  sequence([constant("--"), zeroToOne(whitespace), zeroToMany(notNewline)]),
  (v) => combineComments(v[2].join(""))
);

function lookAhead(rule: Rule<unknown>): Rule<null> {
  const newRule: Rule<null> = (ctx: Context) => {
    const curr = rule(ctx);

    if (curr.type === ResultType.Success) {
      return {
        type: ResultType.Success,
        value: null,
        length: 0, // <-- unlike most rules, this one does not progress the position
        expected: [],
        pos: ctx.pos,
      };
    }

    return curr;
  };

  return newRule;
}

/**
 * __ Removes all whitespace and grabs any comments
 */
export const __ = transform(
  // We can have any number of whitespace or comments
  zeroToMany(or([cStyleComment, sqlStyleComment, whitespace])),
  (v) => combineComments(...v)
);

/**
 * Unlike "__", "_" only grabs comments directly above the statement.
 * This way we can have these standalone comments captured seperatly
 */
export const _ = transform(
  sequence([
    // We can have an unlimited amount of whitespace before our comments
    zeroToMany(whitespace),
    // We can have many comments, as long theres not newlines before them
    zeroToMany(or([cStyleComment, sqlStyleComment, whitespaceWithoutNewline])),
  ]),
  (v) => combineComments(...v[1]).trim()
);

const lookForWhiteSpaceOrComment = // we want to ensure the next character is a whitespace
  // or start of a comment, but we do not want to incliude
  // it in the sequence.
  //
  // Examples:
  // ✓ SET statement_timeout = 0;
  // ✓ SET/* foo */statement_timeout = 0;
  // ✗ SETstatement_timeout = 0;
  lookAhead(
    or([
      whitespace,
      cStyleComment,
      sqlStyleComment,
      endOfInput,
      constant(","),
      constant(";"),
      constant("("), // <-- in column definition
    ])
  );

/**
 * Unlike a sequence, a phrase handles whitespace and comments
 * detection between each rule
 */
export function phrase<A>(
  rules: [Rule<A>]
): Rule<{ value: [A]; comment: string }>;
export function phrase<A, B>(
  rules: [Rule<A>, Rule<B>]
): Rule<{ value: [A, B]; comment: string }>;
export function phrase<A, B, C>(
  rules: [Rule<A>, Rule<B>, Rule<C>]
): Rule<{ value: [A, B, C]; comment: string }>;
export function phrase<A, B, C, D>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]
): Rule<{ value: [A, B, C, D]; comment: string }>;
export function phrase<A, B, C, D, E>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>]
): Rule<{ value: [A, B, C, D, E]; comment: string }>;
export function phrase<A, B, C, D, E, F>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>]
): Rule<{ value: [A, B, C, D, E, F]; comment: string }>;
export function phrase<A, B, C, D, E, F, G>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>, Rule<G>]
): Rule<{ value: [A, B, C, D, E, F, G]; comment: string }>;
export function phrase<A, B, C, D, E, F, G, H>(
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
): Rule<{ value: [A, B, C, D, E, F, G, H]; comment: string }>;
export function phrase<A, B, C, D, E, F, G, H, I>(
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
): Rule<{ value: [A, B, C, D, E, F, G, H, I]; comment: string }>;
export function phrase<A, B, C, D, E, F, G, H, I, J>(
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
): Rule<{ value: [A, B, C, D, E, F, G, H, I, J]; comment: string }>;
export function phrase(rules: Rule<any>[]): Rule<any> {
  const newRules: Rule<any>[] = [_]; // <-- Capture direct comments above

  // Lets add __ between each rule.
  for (let index = 0; index < rules.length; index += 1) {
    newRules.push(rules[index]);

    if (index < rules.length - 1) {
      newRules.push(__);
    }
  }

  // @ts-expect-error
  return transform(sequence(newRules), (result) => {
    // Even number idicies are our whitespace/comments
    const comments = result.filter((v, i) => i % 2 === 0);

    // Odd number idicies are our rules.
    const values = result.filter((v, i) => i % 2 === 1);

    return {
      comment: combineComments(...comments),
      value: values,
    };
  });
}

/**
 * Kinda like oneToMany, but smartly capturing comments in between tokens.
 */

export const commentsOnSameLine = transform(
  sequence([
    zeroToMany(or([cStyleCommentWithoutNewline, whitespaceWithoutNewline])),
    optional(sqlStyleCommentWithoutNewline),
  ]),

  // We can trim because we don't care if its indented on one line.
  (v) =>
    combineComments(
      v[0]
        .concat(v[1] ?? "")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" ")
    ).replace(/\n/gi, "")
);

export function listWithCommentsPerItem<T>(
  rule: Rule<T>,
  separator?: Rule<unknown>
): Rule<{ value: { value: T; comment: string }[]; comment: string }> {
  // Since we are using recursion, we need to nest this definition.
  return (ctx: Context) => {
    const result = or([
      // Recursion on rule
      transform(
        sequence([
          transform(zeroToTen(_), (v) => v.filter(Boolean)), // We only
          rule,
          separator ? __ : placeholder, // if there is not seperator lets ignore the extra space
          separator ?? placeholder,
          commentsOnSameLine,
          listWithCommentsPerItem(rule, separator),
        ]),
        (v) => {
          const commentForListItem = v[0][v[0].length - 1] ?? "";
          return {
            value: [
              {
                value: v[1],
                comment: combineComments(commentForListItem, v[2], v[4]),
              },
            ].concat(v[5].value),
            // If there are comments visually seperated lets not associate those comments
            // with a list item.
            comment: combineComments(...v[0].slice(0, -1).concat(v[5].comment)),
          };
        }
      ),

      // Single rule
      transform(sequence([_, rule, commentsOnSameLine, __]), (v) => ({
        value: [
          {
            comment: combineComments(v[0], v[2]),
            value: v[1],
          },
        ],
        comment: v[3],
      })),
    ])(ctx);

    return result;
  };
}

export function list<T>(
  rule: Rule<T>,
  separator?: Rule<unknown>
): Rule<{ value: T[]; comment: string }> {
  // Since we are using recursion, we need to nest this definition.
  const newRule: Rule<{
    value: T[];
    comment: string;
  }> = (ctx: Context) => {
    return or([
      // Recursion on rule
      transform(
        sequence([
          __,
          rule,
          __,
          separator ?? placeholder,
          __,
          list(rule, separator),
        ]),
        (v) => {
          return {
            value: [v[1]].concat(v[5].value),
            // If there are comments visually seperated lets not associate those comments
            // with a list item.
            comment: combineComments(v[0], v[2], v[4], v[5].comment),
          };
        }
      ),

      // Single rule
      transform(sequence([__, rule, __]), (v) => ({
        value: [v[1]],
        comment: combineComments(v[0], v[2]),
      })),
    ])(ctx);
  };

  return newRule;
}

/**
 * Keywords / constants
 */
const keywordList = [
  "ADD",
  "AFTER",
  "ALTER",
  "AS",
  "BEFORE",
  "BY",
  "CACHE",
  "CASCADE",
  "CONCURRENTLY",
  "COLUMN",
  "CREATE",
  "CYCLE",
  "DEFAULT",
  "DROP",
  "ENUM",
  "EXISTS",
  "FOREIGN",
  "IF",
  "INCREMENT",
  "INDEX",
  "KEY",
  "MAXVALUE",
  "MINVALUE",
  "NO",
  "NONE",
  "NOT",
  "NULL",
  "ON",
  "ONLY",
  "OWNED",
  "OWNER",
  "PRIMARY",
  "PUBLIC",
  "REFERENCES",
  "RENAME",
  "RESTRICT",
  "SEQUENCE",
  "SET",
  "START",
  "TABLE",
  "TO",
  "UNIQUE",
  "USING",
  "VALUE",
  "WITH",
] as const;

export function keyword(
  str: typeof keywordList[number]
): Rule<{ start: number; value: string }> {
  return (ctx) => {
    const result = transform(
      sequence([
        constant(str),
        // we want to ensure the next character is a whitespace
        // or start of a comment, but we do not want to incliude
        // it in the sequence.
        //
        // Examples:
        // ✓ SET statement_timeout = 0;
        // ✓ SET/* foo */statement_timeout = 0;
        // ✗ SETstatement_timeout = 0;
        lookForWhiteSpaceOrComment,
      ]),
      (v) => ({ start: v[0].start, value: str })
    )(ctx);

    result.expected =
      result.type === ResultType.Success
        ? []
        : [{ type: "keyword", value: `"${str}"`, pos: ctx.pos }];

    return result;
  };
}
export const ADD = keyword("ADD");
export const AFTER = keyword("AFTER");
export const ALTER = keyword("ALTER");
export const AS = keyword("AS");
export const BEFORE = keyword("BEFORE");
export const BY = keyword("BY");
export const CACHE = keyword("CACHE");
export const CASCADE = keyword("CASCADE");
export const CONCURRENTLY = keyword("CONCURRENTLY");
export const COLUMN = keyword("COLUMN");
export const CREATE = keyword("CREATE");
export const CYCLE = keyword("CYCLE");
export const DEFAULT = keyword("DEFAULT");
export const DROP = keyword("DROP");
export const ENUM = keyword("ENUM");
export const EXISTS = keyword("EXISTS");
export const FOREIGN = keyword("FOREIGN");
export const IF = keyword("IF");
export const INCREMENT = keyword("INCREMENT");
export const INDEX = keyword("INDEX");
export const KEY = keyword("KEY");
export const MAXVALUE = keyword("MAXVALUE");
export const MINVALUE = keyword("MINVALUE");
export const NO = keyword("NO");
export const NONE = keyword("NONE");
export const NOT = keyword("NOT");
export const NULL = keyword("NULL");
export const ON = keyword("ON");
export const ONLY = keyword("ONLY");
export const OWNED = keyword("OWNED");
export const OWNER = keyword("OWNER");
export const PRIMARY = keyword("PRIMARY");
export const PUBLIC = keyword("PUBLIC");
export const REFERENCES = keyword("REFERENCES");
export const RENAME = keyword("RENAME");
export const RESTRICT = keyword("RESTRICT");
export const SEQUENCE = keyword("SEQUENCE");
export const SET = keyword("SET");
export const START = keyword("START");
export const TABLE = keyword("TABLE");
export const TO = keyword("TO");
export const TYPE = keyword("TYPE" as any); // <-- One exeption where we can use it ad an identifier
export const UNIQUE = keyword("UNIQUE");
export const USING = keyword("USING");
export const VALUE = keyword("VALUE");
export const WITH = keyword("WITH");

export const SEMICOLON = constant(";");
export const EQUALS = constant("=");
export const NUMERAL = regexChar(/[0-9]/);
export const PERIOD = constant(".");
export const QUOTE = constant("'");
export const NOT_QUOTE = notConstant("'");
export const LPAREN = constant("(");
export const RPAREN = constant(")");
export const COMMA = constant(",");

export const ifNotExists: Rule<string> = (ctx: Context) => {
  const rule = transform(sequence([IF, __, NOT, __, EXISTS]), (v) =>
    combineComments(v[1], v[3])
  );

  const result = rule(ctx);

  if (result.type === ResultType.Fail) {
    return {
      ...result,
      expected: [
        {
          type: "keyword",
          value: "IF NOT EXISTS",
          pos: ctx.pos,
        },
      ],
    };
  }

  return result;
};

export const identifier: Rule<string> = (ctx: Context) => {
  const result = transform(
    sequence([regexChar(/[a-zA-Z_]/), zeroToMany(regexChar(/[a-zA-Z0-9_]/))]),
    (v) => v[0].concat(v[1].join("")).toLowerCase()
  )(ctx);

  if (result.type === ResultType.Fail) {
    return {
      ...result,
      expected: [{ type: "identifier", value: "identifier", pos: ctx.pos }],
    };
  }

  if ((keywordList as readonly string[]).includes(result.value.toUpperCase())) {
    return {
      type: ResultType.Fail,
      expected: [{ type: "identifier", value: "identifier", pos: ctx.pos }],
      pos: ctx.pos,
    };
  }

  return result;
};

export const tableIdentifier = transform(
  sequence([optional(sequence([identifier, PERIOD])), identifier]),
  (v) =>
    v[0]
      ? [v[0][0].toLocaleLowerCase(), v[1].toLocaleLowerCase()]
      : [v[1].toLocaleLowerCase()]
);
tableIdentifier.identifier = "table identifier";

export const integer = transform(oneToMany(NUMERAL), (s) => Number(s.join("")));
integer.identifier = "integer";

/**
 * Common
 */

export const quotedString = transform(
  sequence([QUOTE, zeroToMany(NOT_QUOTE), QUOTE]),
  (v) => v[1].join("")
);
quotedString.identifier = "quoted string";

/**
 * Statement utility
 */

export const endOfStatement = transform(
  or([
    endOfInput,
    // Lets also eagerly goble up semicolons
    zeroToMany(
      sequence([
        SEMICOLON,
        // Lets include all the comments on the same line as the semicolumn
        commentsOnSameLine,
        // There can be any amount of whitespace afterwards
        zeroToMany(whitespace),
      ])
    ),
  ]),
  (v, context) => {
    if (v && v.length > 0) {
      // The first semicolon is when the statement ends
      context.endOfStatement.push(v[0]?.[0].start);

      // The last semi colon is used to indicate when the next statement
      context.startOfNextStatement.push(v[v.length - 1]?.[0].start);
      return combineComments(...v.map((iv) => iv[1]));
    }
    return "";
  }
);

export function optional<T>(rule: Rule<T>): Rule<T | null> {
  const newRule: Rule<T | null> = or([rule, placeholder]);

  newRule.identifier = `${rule.identifier}?`;

  return newRule;
}
