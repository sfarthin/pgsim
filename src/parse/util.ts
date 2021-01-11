/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Types
 */

import { lstat } from "fs";

export enum ResultType {
  Fail = "___FAIL___",
  Success = "___SUCCESS___",
}

export type SuccessResult<R> = {
  type: ResultType.Success;
  value: R;
  length: number;
};

export type RuleResult<R> =
  | {
      type: ResultType.Fail;
      msg: string;
    }
  | SuccessResult<R>;

export type Context = { endOfStatement: number[]; str: string; pos: number };

export type Rule<R> = (c: Context) => RuleResult<R>;

const placeholder: Rule<null> = () => ({
  type: ResultType.Success,
  value: null,
  length: 0,
});

export function constant(
  keyword: string
): Rule<{ start: number; value: string }> {
  return (ctx) => {
    const potentialKeyword = ctx.str.substring(
      ctx.pos,
      ctx.pos + keyword.length
    );

    if (potentialKeyword.toLowerCase() === keyword.toLowerCase()) {
      return {
        type: ResultType.Success,
        value: { start: ctx.pos, value: keyword },
        length: keyword.length,
      };
    }

    return {
      type: ResultType.Fail,
      pos: ctx.pos,
      msg: `Expected to find "${keyword}"`,
    };
  };
}

function regexChar(r: RegExp): Rule<string> {
  if (r.global) {
    throw new Error(
      "Cannot use global match. See https://stackoverflow.com/questions/209732/why-am-i-seeing-inconsistent-javascript-logic-behavior-looping-with-an-alert-v"
    );
  }
  return ({ str, pos }) => {
    const char = str.charAt(pos);
    if (r.test(char)) {
      return {
        type: ResultType.Success,
        value: char,
        length: 1,
      };
    }
    return {
      type: ResultType.Fail,
      pos,
      msg: `Expected "${char}" to match ${r.toString()}`,
    };
  };
}

function multiply<T>(
  rule: Rule<T>,
  min: number,
  max: number | null
): Rule<T[]> {
  return (ctx) => {
    let curr: RuleResult<T>;
    const start = ctx.pos;
    let pos = ctx.pos;
    const values = [];
    while (pos < ctx.str.length && (max === null || values.length < max)) {
      curr = rule({ ...ctx, pos });
      if (curr.type === ResultType.Success) {
        pos += curr.length;
        values.push(curr.value);
      } else {
        break;
      }
    }

    if (values.length < min) {
      return {
        type: ResultType.Fail,
        msg: `Expected to find at least ${min} occurances`,
      };
    }

    return {
      type: ResultType.Success,
      value: values,
      length: pos - start,
    };
  };
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
const whitespaceWithoutNewline = regexChar(/[ \t\r]/);

function notConstant(keyword: string): Rule<string> {
  return (ctx) => {
    const potentialKeyword = ctx.str.substring(
      ctx.pos,
      ctx.pos + keyword.length
    );

    if (potentialKeyword.toLowerCase() !== keyword.toLowerCase()) {
      return {
        type: ResultType.Success,
        value: ctx.str.charAt(ctx.pos),
        length: 1,
      };
    }

    return {
      type: ResultType.Fail,
      pos: ctx.pos,
      msg: `Expected not to find ${keyword}`,
    };
  };
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

export function sequence(rules: Rule<any>[]): Rule<any> {
  return (ctx) => {
    let pos = ctx.pos;
    let length = 0;
    const values = [];

    for (const rule of rules) {
      const result = rule({ ...ctx, pos });

      if (result.type === ResultType.Fail) {
        return result;
      }

      pos = pos + result.length;
      length = length + result.length;
      values.push(result.value);
    }

    return {
      type: ResultType.Success,
      value: values,
      length,
    };
  };
}

export function transform<T, R>(
  rule: Rule<T>,
  transform: (i: T, c: Context) => R
): Rule<R> {
  return (ctx) => {
    const result = rule(ctx);
    if (result.type === ResultType.Success) {
      return {
        ...result,
        value: transform(result.value, ctx),
      };
    }
    return result;
  };
}

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

export function or<T>(rules: Rule<any>[]): Rule<any> {
  return (ctx) => {
    const results = rules.map((r) => r(ctx));

    const firstMatch = results.find((r) => {
      return r.type === ResultType.Success;
    });

    if (firstMatch) {
      return firstMatch;
    }

    return {
      type: ResultType.Fail,
      pos: ctx.pos,
      msg: results
        .map((r) => (r.type == ResultType.Fail ? r.msg : null))
        .join(" or "),
    };
  };
}

export function combineComments(...c: (string | null | undefined)[]) {
  return c
    .filter(Boolean)
    .map((s) => (s ?? "").replace(/^\s|\s$/g, ""))
    .join("\n")
    .replace(/\n\n/gi, "\n");
}

export const cStyleComment = transform(
  sequence([
    constant("/*"),
    zeroToMany(notConstant("*/")),
    constant("*/"),
    zeroToOne(constant("\n")),
  ]),
  (v) => combineComments(v[1].join("").replace(/[\*\s]*\n[\*\s]*/gi, "\n"))
);

export const cStyleCommentWithoutNewline = transform(
  sequence([constant("/*"), zeroToMany(notConstant("*/")), constant("*/")]),
  (v) => combineComments(v[1].join("").replace(/[\*\s]*\n[\*\s]*/gi, "\n"))
);

export const sqlStyleComment = transform(
  sequence([
    constant("--"),
    zeroToMany(notConstant("\n")),
    zeroToOne(constant("\n")),
  ]),
  (v) => combineComments(v[1].join(""))
);

export const sqlStyleCommentWithoutNewline = transform(
  sequence([constant("--"), zeroToMany(notConstant("\n"))]),
  (v) => combineComments(v[1].join(""))
);

// const multipleComments = transform(zeroToMany(comment), (s) => s.join("\n"));

function lookAhead(rule: Rule<unknown>): Rule<null> {
  return (ctx) => {
    const curr = rule(ctx);

    if (curr.type === ResultType.Success) {
      return {
        type: ResultType.Success,
        value: null,
        length: 0, // <-- unlike most rules, this one does not progress the position
      };
    }

    return curr;
  };
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
const _ = transform(
  sequence([
    // We can have an unlimited amount of whitespace before our comments
    zeroToMany(whitespace),
    // We can have many comments, as long theres not newlines before them
    zeroToMany(or([cStyleComment, sqlStyleComment, whitespaceWithoutNewline])),
  ]),
  (v) => combineComments(...v[1])
);

export const endOfInput: Rule<null> = (ctx) => {
  if (ctx.pos == ctx.str.length) {
    return {
      type: ResultType.Success,
      value: null,
      length: 0, // <-- unlike most rules, this one does not progress the position
    };
  }

  return {
    type: ResultType.Fail,
    pos: ctx.pos,
    msg: "Expected to be end of input",
  };
};

function keyword(str: string): Rule<{ start: number; value: string }> {
  return transform(
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
      lookAhead(or([whitespace, cStyleComment, sqlStyleComment, endOfInput])),
    ]),
    (v) => ({ start: v[0].start, value: str })
  );
}

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

const commentsOnSameLine = transform(
  zeroToMany(
    or([
      sqlStyleCommentWithoutNewline,
      cStyleCommentWithoutNewline,
      whitespaceWithoutNewline,
    ])
  ),
  (v) => combineComments(...v)
);

export function list<T>(
  rule: Rule<T>,
  separator?: Rule<unknown>
): Rule<{ value: { value: T; comment: string }[]; comment: string }> {
  // Since we are using recursion, we need to nest this definition.
  return (ctx) => {
    return or([
      // Recursion on rule
      transform(
        sequence([
          transform(zeroToTen(_), (v) => v.filter(Boolean)), // We only
          rule,
          __,
          separator ?? placeholder,
          commentsOnSameLine,
          list(rule, separator),
        ]),
        (v) => {
          // console.log(v[0]);
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
  };
}

// console.log(
//   list(
//     constant("F"),
//     constant(",")
//   )({ pos: 0, str: "F  /* asdas */ ,   F,F,F", endOfStatement: [] })
// );

export function statement<A, B>(
  rules: [Rule<A>, Rule<B>]
): Rule<{ value: [A, B]; comment: string }>;
export function statement<A, B, C>(
  rules: [Rule<A>, Rule<B>, Rule<C>]
): Rule<{ value: [A, B, C]; comment: string }>;
export function statement<A, B, C, D>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>]
): Rule<{ value: [A, B, C, D]; comment: string }>;
export function statement<A, B, C, D, E>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>]
): Rule<{ value: [A, B, C, D, E]; comment: string }>;
export function statement<A, B, C, D, E, F>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>]
): Rule<{ value: [A, B, C, D, E, F]; comment: string }>;
export function statement<A, B, C, D, E, F, G>(
  rules: [Rule<A>, Rule<B>, Rule<C>, Rule<D>, Rule<E>, Rule<F>, Rule<G>]
): Rule<{ value: [A, B, C, D, E, F, G]; comment: string }>;
export function statement<A, B, C, D, E, F, G, H>(
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
export function statement<A, B, C, D, E, F, G, H, I>(
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
export function statement<A, B, C, D, E, F, G, H, I, J>(
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
export function statement(rules: any): Rule<any> {
  return transform(
    phrase(rules.concat(endOfStatement)),
    ({ comment, value }) => ({
      // All the values except endOfStatement
      value: value.slice(0, -1),
      // add the comment at the end of the line
      // @ts-expect-error
      comment: combineComments(comment, value[rules.length]),
    })
  );
}

/**
 * Keywords / constants
 */

export const SET = keyword("SET");
export const PUBLIC = keyword("PUBLIC");
export const CREATE = keyword("CREATE");
export const TYPE = keyword("TYPE");
export const AS = keyword("AS");
export const ENUM = keyword("ENUM");

export const SEMICOLON = constant(";");
export const EQUALS = constant("=");

export const NUMERAL = regexChar(/[0-9]/);
export const PERIOD = constant(".");
export const QUOTE = constant("'");
export const NOT_QUOTE = notConstant("'");
export const LPAREN = constant("(");
export const RPAREN = constant(")");
export const COMMA = constant(",");

export const identifier = transform(
  sequence([regexChar(/[a-zA-Z_]/), zeroToMany(regexChar(/[a-zA-Z0-9_]/))]),
  (v) => v[0].concat(v[1].join(""))
);

export const tableIdentifier = transform(
  sequence([zeroToOne(sequence([PUBLIC, PERIOD])), identifier]),
  (v) => v[1]
);

/**
 * Common
 */

export const quotedString = transform(
  sequence([QUOTE, zeroToMany(NOT_QUOTE), QUOTE]),
  (v) => v[1].join("")
);

/**
 * Statement utility
 */

const endOfStatement = transform(
  or([
    endOfInput,
    // Lets also eagerly goble up semicolons
    zeroToMany(
      sequence([
        SEMICOLON,
        // Lets include all the comments on the same line as the semicolumn
        zeroToMany(
          or([cStyleComment, sqlStyleComment, whitespaceWithoutNewline])
        ),
        // There can be any amount of whitespace afterwards
        zeroToMany(whitespace),
      ])
    ),
  ]),
  (v, context) => {
    if (v) {
      context.endOfStatement.push(v[0]?.[0].start);
      return combineComments(...v.map((iv) => combineComments(...iv[1])));
    }

    // context.endOfStatement.push(end);
    return "";
  }
);
