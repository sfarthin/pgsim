/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeOrAlias } from "~/constants";
import { StmtType } from "~/types";
import { NEWLINE, TAB } from "../format/print";
import { Block } from "../format/util";
import { expectedReducer } from "./expectedReducer";
import { or } from "./or";
import { sequence } from "./sequence";

export { or } from "./or";
export { sequence } from "./sequence";

export enum ResultType {
  Fail = "___FAIL___",
  Success = "___SUCCESS___",
}

// Todo reconcile this more with Tokens
export type Expected = {
  tokens: Block;
  type: "keyword" | "notKeyword" | "regex" | "identifier" | "endOfInput";
  pos: number;
  value: string;

  /**
   * We can add references that will help give more details about
   */
  stmtType?: StmtType;
};

type SuccessResultBase<R> = {
  type: ResultType.Success;
  /**
   * The Abstract Syntax Tree
   */
  value: R;

  /**
   * The character length of the rule. For Stmt this is always the entire SQL length,
   * but is useful in sub-rules.
   */
  length: number;

  /**
   * Sometimes we get a successful result but it may fail later and we still need to
   * refer to this expected result
   */
  expected: Expected[];
};

export type SuccessResult<R> =
  /**
   * This is the original SQL segmented in Unformatted Nodes so we can
   * print the SQL back in color.
   */
  SuccessResultBase<R> & { tokens: Block };

type SuccessBufferResult<R> = SuccessResultBase<R> & {
  buffer: [number, number];
};

export type FailResult = {
  type: ResultType.Fail;
  expected: Expected[];
  /**
   * The ending location where the parser could no longer parse
   */
  pos: number;
};

export type RuleResult<R> = FailResult | SuccessResult<R>;
type BufferRuleResult<R> = FailResult | SuccessBufferResult<R>;

export type Context = {
  /**
   * Original SQL
   */
  str: string;

  /**
   * position we have parsed so far
   */
  pos: number;

  /**
   * We can take on how many statements we were able to
   */
  numStatements: number;
};

export type Rule<R> = (c: Context) => RuleResult<R>;

// TODO Type Buffer and Node Rule seperately.
// use generics one methods that can be both.
export type BufferRule<R> = (s: Context) => BufferRuleResult<R>;

export type EitherRule<R> = (c: Context) => RuleResult<R> | BufferRuleResult<R>;

export function combineBlocks(input1: Block, input2: Block): Block {
  if (input1.length === 0) {
    return input2;
  }

  if (input2.length === 0) {
    return input1;
  }

  return [
    ...input1.slice(0, -1),
    [...input1[input1.length - 1], ...input2[0]],
    ...input2.slice(1),
  ];
}

export function blockLength(block: Block): number {
  let length = 0;

  for (const line of block) {
    for (const token of line) {
      if ("text" in token) {
        length += token.text.length;
      } else {
        length += 1;
      }
    }
    length += 1;
  }

  return length;
}

export const placeholder: Rule<null> = (ctx) => ({
  type: ResultType.Success,
  value: null,
  expected: [],
  length: 0,
  tokens: [],
});

export const endOfInput: Rule<number> = (ctx) => {
  if (ctx.pos == ctx.str.length) {
    return {
      type: ResultType.Success,
      value: ctx.pos,
      length: 0, // <-- unlike most rules, this one does not progress the position
      expected: [],
      tokens: [],
    };
  }

  return {
    type: ResultType.Fail,
    expected: [
      { type: "endOfInput", value: "End of Input", pos: ctx.pos, tokens: [] },
    ],
    pos: ctx.pos,
  };
};

const endOfInputBuffer: BufferRule<number> = (ctx) => {
  if (ctx.pos == ctx.str.length) {
    return {
      type: ResultType.Success,
      value: ctx.pos,
      length: 0, // <-- unlike most rules, this one does not progress the position
      expected: [],
      buffer: [ctx.pos, ctx.pos],
    };
  }

  return {
    type: ResultType.Fail,
    expected: [
      { type: "endOfInput", value: "End of Input", pos: ctx.pos, tokens: [] },
    ],
    pos: ctx.pos,
  };
};

export function constant(
  keyword: string
): BufferRule<{ start: number; value: string }> {
  const rule: BufferRule<{ start: number; value: string }> = (ctx: Context) => {
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
        buffer: [ctx.pos, ctx.pos + keyword.length],
      };
    }

    return {
      type: ResultType.Fail,
      expected: [
        {
          type: "keyword",
          value: `"${keyword}"`,
          pos: ctx.pos,
          tokens: [],
        },
      ],
      pos: ctx.pos,
    };
  };

  return rule;
}

export const symbol = (keyword: string) =>
  fromBufferToCodeBlock(constant(keyword), (buffer) => [
    [{ type: "symbol", text: buffer }],
  ]);

export function regexChar(r: RegExp): BufferRule<string> {
  if (r.global) {
    throw new Error(
      "Cannot use global match. See https://stackoverflow.com/questions/209732/why-am-i-seeing-inconsistent-javascript-logic-behavior-looping-with-an-alert-v"
    );
  }
  const rule: BufferRule<string> = ({ str, pos }) => {
    const char = str.charAt(pos);
    if (r.test(char)) {
      return {
        type: ResultType.Success,
        value: char,
        length: 1,
        expected: [],
        pos,
        buffer: [pos, pos + 1],
      };
    }
    return {
      type: ResultType.Fail,
      expected: [{ type: "regex", value: r.toString(), pos, tokens: [] }],
      pos,
    };
  };

  return rule;
}

function multiply<T>(
  rule: BufferRule<T>,
  min: number,
  max: number | null
): BufferRule<T[]>;
function multiply<T>(rule: Rule<T>, min: number, max: number | null): Rule<T[]>;
function multiply<T>(
  rule: EitherRule<T>,
  min: number,
  max: number | null
): EitherRule<T[]>;
function multiply<T>(
  rule: EitherRule<T>,
  min: number,
  max: number | null
): EitherRule<T[]> {
  const _multiply: EitherRule<T[]> = (ctx: Context) => {
    let curr;
    const start = ctx.pos;
    let pos = ctx.pos;
    const values = [];
    let expected: Expected[] = [];
    let lastPos = pos;

    // It can be one or the other.
    let tokens: Block = [];
    let buffer: [number, number] = [pos, pos];
    while (pos < ctx.str.length && (max === null || values.length < max)) {
      const prevPos = ctx.pos;
      ctx.pos = pos;
      curr = rule(ctx);
      ctx.pos = prevPos;

      expected = expected
        .concat(
          curr.expected.map((e) => ({
            ...e,
            tokens: combineBlocks(tokens, e.tokens),
          }))
        )
        .reduce(expectedReducer, []);

      if (curr.type === ResultType.Success) {
        if ("tokens" in curr) {
          tokens = combineBlocks(tokens, curr.tokens);
        } else {
          buffer = [buffer[0], curr.buffer[1]];
        }

        pos += curr.length;
        values.push(curr.value);
        lastPos = pos;
      } else {
        lastPos = curr.pos;
        break;
      }
    }

    if (tokens.length && buffer[1] === pos) {
      throw new Error(
        `Invalid expression, expression must be nodes or buffer: ${tokens.length},${buffer.length}`
      );
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
      ...(tokens.length ? { tokens } : { buffer }),
    };
  };

  return _multiply;
}

export function zeroToMany<T>(rule: Rule<T>): Rule<T[]>;
export function zeroToMany<T>(rule: BufferRule<T>): BufferRule<T[]>;
export function zeroToMany<T>(rule: EitherRule<T>): EitherRule<T[]> {
  return multiply(rule, 0, null);
}

export function oneToMany<T>(rule: Rule<T>): Rule<T[]>;
export function oneToMany<T>(rule: BufferRule<T>): BufferRule<T[]>;
export function oneToMany<T>(rule: EitherRule<T>): EitherRule<T[]> {
  return multiply(rule, 1, null);
}

export function zeroToOne<T>(rule: Rule<T>): Rule<T[]>;
export function zeroToOne<T>(rule: BufferRule<T>): BufferRule<T[]>;
export function zeroToOne<T>(rule: EitherRule<T>) {
  return multiply(rule, 0, 1);
}

export function zeroToTen<T>(rule: Rule<T>): Rule<T[]>;
export function zeroToTen<T>(rule: BufferRule<T>): BufferRule<T[]>;
export function zeroToTen<T>(rule: EitherRule<T>) {
  return multiply(rule, 0, 10);
}

export const whitespace: Rule<null> = transform(
  fromBufferToCodeBlock(regexChar(/[ \t\r\n]/), (str) => {
    return str === " "
      ? [[{ type: "space" }]]
      : str === TAB
      ? [[{ type: "tab" }]]
      : [[], []]; // <-- newline
  }),
  () => null
);
export const whitespaceWithoutNewline = fromBufferToCodeBlock(
  regexChar(/[ \t\r]/),
  (str) => [[str === " " ? { type: "space" } : { type: "tab" }]]
);

export function notConstant(keyword: string): BufferRule<string> {
  const rule: BufferRule<string> = (ctx: Context) => {
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
        buffer: [ctx.pos, ctx.pos + 1],
      };
    }

    return {
      type: ResultType.Fail,
      expected: [
        {
          type: "notKeyword",
          value: `not "${keyword}"`,
          pos: ctx.pos,
          tokens: [],
        },
      ],
      pos: ctx.pos,
    };
  };

  return rule;
}

export function transform<T, R>(
  rule: BufferRule<T>,
  transform: (i: T, c: Context, r: SuccessResult<T>) => R
): BufferRule<R>;
export function transform<T, R>(
  rule: Rule<T>,
  transform: (i: T, c: Context, r: SuccessResult<T>) => R
): Rule<R>;
export function transform<T, R>(
  rule: EitherRule<T>,
  transform: (
    i: T,
    c: Context,
    r: SuccessResult<T> // <-- THis is really right, but we never access this during bufferResults
  ) => R
): EitherRule<R> {
  const _transform: EitherRule<R> = (ctx) => {
    const result = rule(ctx);
    if (result.type === ResultType.Success) {
      return {
        ...result,
        value: transform(result.value, ctx, result as SuccessResult<T>),
      };
    }
    return result;
  };

  return _transform;
}

export function fromBufferToCodeBlock<T>(
  rule: BufferRule<T>,
  func: (buffer: string, result: BufferRuleResult<T>) => Block
): Rule<T> {
  const _fromBufferToCodeBlock: Rule<T> = (ctx) => {
    const result = rule(ctx);

    if (result.type === ResultType.Success) {
      const { buffer, ...everythingButBuffer } = result;
      return {
        ...everythingButBuffer,
        tokens: func(ctx.str.substring(buffer[0], buffer[1]), result),
      };
    } else {
      return result;
    }
  };

  return _fromBufferToCodeBlock;
}

export function combineComments(...c: (string | null | undefined)[]) {
  // return c.flatMap((s) => (Boolean(s) ? [s ?? ""] : [])).join(NEWLINE);

  return c
    .filter(Boolean)
    .map((s) => s ?? "")
    .join(NEWLINE);
}

export const cStyleComment: Rule<string> = fromBufferToCodeBlock(
  transform(
    sequence([
      constant("/*"),
      zeroToMany(notConstant("*/")),
      constant("*/"),
      zeroToOne(constant(NEWLINE)),
    ]),
    (v) =>
      combineComments(
        v[1]
          .join("")
          .replace(/\n[\s\t ]*\*/gi, NEWLINE)
          .replace(/^[\s\n\t ]*\*/, "")
          .replace(/\n$/, "")
      ).trim() // we can trim individual cStyle comments because they are unlikey to be indented with other comments.
  ),
  (buffer) => {
    return [
      [
        {
          type: "comment",
          text: buffer,
          style: "c",
        },
      ],
    ];
  }
);

export const cStyleCommentWithoutNewline: Rule<string> = fromBufferToCodeBlock(
  transform(
    sequence([constant("/*"), zeroToMany(notConstant("*/")), constant("*/")]),
    (v) =>
      combineComments(
        v[1]
          .join("")
          .replace(/\n[\s\t ]*\*/gi, NEWLINE)
          .replace(/^[\s\n\t ]*\*/, "")
          .replace(/\n$/, "")
      ).trim()
  ),
  (buffer) => [
    [
      {
        type: "comment",
        text: buffer,
        style: "c",
      },
    ],
  ]
);

export const sqlStyleComment: Rule<string> = fromBufferToCodeBlock(
  transform(
    sequence([
      constant("--"),
      zeroToOne(regexChar(/[ \t\r]/)),
      zeroToMany(notConstant(NEWLINE)),
      or([constant(NEWLINE), endOfInputBuffer]),
    ]),
    (v) => combineComments(v[2].join(""))
  ),
  (buffer) =>
    buffer[buffer.length - 1] === NEWLINE
      ? [
          [
            {
              type: "comment",
              text: buffer.substring(0, buffer.length - 1),
              style: "sql",
            },
          ],
          [], // <-- Makes a newline
        ]
      : [
          [
            {
              type: "comment",
              text: buffer,
              style: "sql",
            },
          ],
        ]
);

export const sqlStyleCommentWithoutNewline: Rule<string> =
  fromBufferToCodeBlock(
    transform(
      sequence([
        constant("--"),
        zeroToOne(regexChar(/[ \t\r\n]/)),
        zeroToMany(notConstant(NEWLINE)),
      ]),
      (v) => combineComments(v[2].join(""))
    ),
    (buffer) => [
      [
        {
          type: "comment",
          text: buffer,
          style: "sql",
        },
      ],
    ]
  );

export function lookAhead<T>(rule: Rule<T>): Rule<T> {
  const _lookAhead: Rule<T> = (ctx: Context) => {
    const curr = rule(ctx);

    if (curr.type === ResultType.Success) {
      return {
        ...curr,
        type: ResultType.Success,
        value: curr.value,
        length: 0, // <-- unlike most rules, this one does not progress the position
        expected: [],
        tokens: [],
      };
    }

    return curr;
  };

  return _lookAhead;
}

/**
 * __ Removes all whitespace and grabs any comments
 */
export const __: Rule<string> = transform(
  // We can have any number of whitespace or comments
  zeroToMany(or([cStyleComment, sqlStyleComment, whitespace])),
  (v) => {
    return combineComments(...v);
  }
);

/**
 * Unlike "__", "_" only grabs comments directly above the statement.
 * This way we can have these standalone comments captured seperatly
 */

export const _: Rule<string> = transform(
  sequence([
    // We can have an unlimited amount of whitespace before our comments
    zeroToMany(whitespace),
    // We can have many comments, as long theres not newlines before them
    zeroToMany(or([cStyleComment, sqlStyleComment, whitespaceWithoutNewline])),
  ]),
  (v) => combineComments(...v[1]).trim()
);

export const lookForWhiteSpaceOrComment = // we want to ensure the next character is a whitespace
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
      symbol("("), // <-- in column definition
      symbol(")"),
      symbol(","),
      symbol(";"),
    ])
  );

export const lookForWhiteSpaceOrCommentOrOperator = lookAhead(
  or([
    whitespace,
    cStyleComment,
    sqlStyleComment,
    endOfInput,
    symbol("("), // <-- in column definition
    symbol(")"),
    symbol(","),
    symbol(";"),
    symbol("="),
    or([
      symbol("<"),
      symbol(">"),
      symbol("*"),
      symbol("/"),
      symbol("!"),
      symbol("%"),
      symbol("+"),
      symbol("-"),
    ]),
  ])
);

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

/**
 * Keywords / constants
 */
const keywordList = [
  "ALL",
  "AND",
  "ACTION",
  "ADD",
  "BEGIN",
  "AFTER",
  "ALTER",
  "AS",
  "ASC",
  "BEFORE",
  "BY",
  "CACHE",
  "CASCADE",
  "CASE",
  "CONCURRENTLY",
  // "CONSTRAINT",
  "COLUMN",
  "COMMIT",
  "CREATE",
  "CYCLE",
  "CURRENT",
  // "DEFAULT",
  "DATABASE",
  "DELETE",
  "DESC",
  "DROP",
  "ORDER",
  "ENUM",
  "END",
  "ELSE",
  "EXISTS",
  "FOREIGN",
  "FROM",
  "GROUP",
  "HOUR",
  "IF",
  "IN",
  "INCREMENT",
  "INTERVAL",
  "INDEX",
  "INNER",
  "JOIN",
  "KEY",
  "LEFT",
  "LIKE",
  "MAXVALUE",
  "MINVALUE",
  "MINUTE",
  "NO",
  "NONE",
  "NOT",
  "IS",
  // "NULL",
  "ON",
  "OR",
  "ORDER",
  "ONLY",
  "OUTER",
  "OWNED",
  "OWNER",
  "PRIMARY",
  "REFERENCES",
  "RENAME",
  "RESTRICT",
  "RESET",
  "RIGHT",
  "ROLLBACK",
  "SEQUENCE",
  "SET",
  "SELECT",
  "START",
  "TABLE",
  "TABLESPACE",
  "TO",
  "TIME",
  "THEN",
  "UNIQUE",
  "UPDATE",
  "USING",
  "VALUE",
  "VIEW",
  "WITH",
  "WHERE",
  "WHEN",
  "ZONE",
] as const;

export function keyword(
  str: typeof keywordList[number] | TypeOrAlias
): Rule<{ start: number; value: string }> {
  const _keyword: Rule<{ start: number; value: string }> = (ctx) => {
    const result = transform(
      sequence([
        fromBufferToCodeBlock(constant(str), (text) => [
          [{ type: "keyword", text }],
        ]),
        // we want to ensure the next character is a whitespace
        // or start of a comment, but we do not want to incliude
        // it in the sequence.
        //
        // Examples:
        // ✓ SET statement_timeout = 0;
        // ✓ SET/* foo */statement_timeout = 0;
        // ✗ SETstatement_timeout = 0;
        lookForWhiteSpaceOrCommentOrOperator,
      ]),
      (v) => ({ start: v[0].start, value: str })
    )(ctx);

    if (result.type === ResultType.Success) {
      return result;
    } else {
      return {
        ...result,
        expected: [
          { type: "keyword", value: `"${str}"`, pos: ctx.pos, tokens: [] },
        ],
      };
    }
  };

  return _keyword;
}

export const ALL = keyword("ALL");
export const DELETE = keyword("DELETE");
export const UPDATE = keyword("UPDATE");

export const ACTION = keyword("ACTION");
export const AND = keyword("AND");
export const ADD = keyword("ADD");
export const AFTER = keyword("AFTER");
export const ALTER = keyword("ALTER");
export const AS = keyword("AS");
export const ASC = keyword("ASC");
export const BEFORE = keyword("BEFORE");
export const BEGIN = keyword("BEGIN");
export const BY = keyword("BY");
export const CACHE = keyword("CACHE");
export const CASCADE = keyword("CASCADE");
export const CASE = keyword("CASE");
export const CONCURRENTLY = keyword("CONCURRENTLY");
export const CONSTRAINT = keyword("CONSTRAINT" as any); // <-- exeption for Truebill
export const COLUMN = keyword("COLUMN");
export const COMMIT = keyword("COMMIT");
export const CREATE = keyword("CREATE");
export const CURRENT = keyword("CURRENT");
export const CYCLE = keyword("CYCLE");
export const DATABASE = keyword("DATABASE");
export const DEFAULT = keyword("DEFAULT" as any); // <-- exeption for Truebill
export const DESC = keyword("DESC");
export const DROP = keyword("DROP");
export const ENUM = keyword("ENUM");
export const END = keyword("END");
export const ELSE = keyword("ELSE");
export const EXISTS = keyword("EXISTS");
export const FOREIGN = keyword("FOREIGN");
export const GROUP = keyword("GROUP");
export const FROM = keyword("FROM");
export const HOUR = keyword("HOUR");
export const IN = keyword("IN");
export const IF = keyword("IF");
export const INCREMENT = keyword("INCREMENT");
export const INDEX = keyword("INDEX");
export const INTERVAL = keyword("INTERVAL");
export const INNER = keyword("INNER");
export const OUTER = keyword("OUTER");
export const JOIN = keyword("JOIN");
export const KEY = keyword("KEY");
export const LEFT = keyword("LEFT");
export const MAXVALUE = keyword("MAXVALUE");
export const MINVALUE = keyword("MINVALUE");
export const MINUTE = keyword("MINUTE");
export const NO = keyword("NO");
export const NONE = keyword("NONE");
export const NOT = keyword("NOT");
export const NULL = keyword("NULL" as any); // <-- exeption for Truebill
export const IS = keyword("IS");
export const ON = keyword("ON");
export const OR = keyword("OR");
export const ORDER = keyword("ORDER");
export const ONLY = keyword("ONLY");
export const OWNED = keyword("OWNED");
export const OWNER = keyword("OWNER");
export const RIGHT = keyword("RIGHT");
export const PRIMARY = keyword("PRIMARY");
export const PUBLIC = keyword("PUBLIC" as any); // <-- One exeption where we can use it ad an identifier
export const REFERENCES = keyword("REFERENCES");
export const RENAME = keyword("RENAME");
export const RESET = keyword("RESET");
export const RESTRICT = keyword("RESTRICT");
export const ROLLBACK = keyword("ROLLBACK");
export const SEQUENCE = keyword("SEQUENCE");
export const SELECT = keyword("SELECT");
export const SET = keyword("SET");
export const START = keyword("START");
export const TABLE = keyword("TABLE");
export const TABLESPACE = keyword("TABLESPACE");
export const TO = keyword("TO");
export const TIME = keyword("TIME");
export const THEN = keyword("THEN");
export const TYPE = keyword("TYPE" as any); // <-- One exeption where we can use it ad an identifier
export const UNIQUE = keyword("UNIQUE");
export const USING = keyword("USING");
export const VALUE = keyword("VALUE");
export const VIEW = keyword("VIEW");
export const WITH = keyword("WITH");
export const WHERE = keyword("WHERE");
export const WHEN = keyword("WHEN");
export const ZONE = keyword("ZONE");

export const SEMICOLON = symbol(";");
export const EQUALS = symbol("=");
export const PERIOD = symbol(".");
export const LPAREN = symbol("(");
export const RPAREN = symbol(")");
export const OPEN_BRACKET = symbol("[");
export const CLOSE_BRACKET = symbol("]");
export const COMMA = symbol(",");
export const STAR = symbol("*");
export const MINUS = symbol("-");

export const ifNotExists: Rule<{ codeComment: string }> = transform(
  sequence([IF, __, NOT, __, EXISTS]),
  (v) => ({ codeComment: combineComments(v[1], v[3]) })
);

export const identifierIncludingKeyword: Rule<string> = (ctx: Context) => {
  const result = fromBufferToCodeBlock(
    or([
      transform(
        sequence([
          regexChar(/[a-zA-Z_]/),
          zeroToMany(regexChar(/[a-zA-Z0-9_]/)),
        ]),
        (v) => v[0].concat(v[1].join("")).toLowerCase() // <-- set to lowercase
      ),
      transform(
        sequence([
          constant('"'),
          regexChar(/[a-zA-Z_]/),
          zeroToMany(regexChar(/[a-zA-Z0-9_]/)),
          constant('"'),
        ]),
        (v) => v[1].concat(v[2].join("")) // <-- not set to lowercase
      ),
    ]),
    (text) => {
      return [[{ type: "identifier", text }]];
    }
  )(ctx);

  if (result.type === ResultType.Fail) {
    return {
      ...result,
      expected: [
        { type: "identifier", value: "identifier", pos: ctx.pos, tokens: [] },
      ],
    };
  }

  return result;
};

export const identifier: Rule<string> = (ctx: Context) => {
  const result = identifierIncludingKeyword(ctx);

  if (result.type === ResultType.Fail) {
    return result;
  }

  // Lets also remove these keywords.
  if ((keywordList as readonly string[]).includes(result.value.toUpperCase())) {
    return {
      type: ResultType.Fail,
      expected: [
        { type: "identifier", value: "identifier", pos: ctx.pos, tokens: [] },
      ],
      pos: ctx.pos,
    };
  }

  return result;
};

export function maybeInParens<T>(rule: Rule<T>): Rule<{
  value: T;
  topCodeComment: string;
  bottomCodeComment: string;
  hasParens: boolean;
}> {
  return or([
    transform(rule, (value) => ({
      topCodeComment: "",
      bottomCodeComment: "",
      value,
      hasParens: false,
    })),
    transform(sequence([LPAREN, __, rule, __, RPAREN]), (v) => ({
      topCodeComment: v[1],
      value: v[2],
      bottomCodeComment: v[3],
      hasParens: true,
    })),
  ]);
}

export const tableIdentifier = transform(
  sequence([optional(sequence([identifier, PERIOD])), identifier]),
  (v) =>
    v[0]
      ? [v[0][0].toLocaleLowerCase(), v[1].toLocaleLowerCase()]
      : [v[1].toLocaleLowerCase()]
);

export const integer = fromBufferToCodeBlock(
  transform(oneToMany(regexChar(/[0-9]/)), (s) => Number(s.join(""))),
  (text) => [[{ type: "numberLiteral", text }]]
);

export const float = fromBufferToCodeBlock(
  transform(
    sequence([
      oneToMany(regexChar(/[0-9]/)),
      constant("."),
      oneToMany(regexChar(/[0-9]/)),
    ]),
    (s) => `${s[0].join("")}.${s[2].join("")}`
  ),
  (text) => {
    return [[{ type: "numberLiteral", text }]];
  }
);

/**
 * Common
 */

export const quotedString = fromBufferToCodeBlock(
  transform(
    sequence([constant("'"), zeroToMany(notConstant("'")), constant("'")]),
    (v, ctx) => ({ value: v[1].join(""), pos: ctx.pos })
  ),
  (text) => [[{ type: "stringLiteral", text }]]
);

/**
 * Statement utility
 */

export type EOS = {
  comment: string;
  firstSemicolonPos: number | null;
  lastSemicolonPos: number | null;
};

export const endOfStatement: Rule<EOS> = transform(
  sequence([
    oneToMany(
      // ^^^ We don't require a semicolon, but the real parser does. oneToMany would require a semicolon.
      sequence([
        SEMICOLON,
        // Lets include all the comments on the same line as the semicolumn
        commentsOnSameLine,
        // There can be any amount of whitespace afterwards
        zeroToMany(whitespace),
      ])
    ),
    zeroToMany(whitespace),
  ]),
  (v) => {
    if (v[0] && v[0].length > 0) {
      const collection = v[0];
      return {
        comment: combineComments(...collection.map((iv) => iv[1])),
        firstSemicolonPos: collection[0][0].start,
        lastSemicolonPos: collection[collection.length - 1][0].start,
      };
    }
    return {
      comment: "",
      firstSemicolonPos: null,
      lastSemicolonPos: null,
    };
  }
);

export function optional<T>(rule: Rule<T>): Rule<T | null> {
  const _optional: Rule<T | null> = or([rule, placeholder]);
  return _optional;
}

export const fail: Rule<never> = (ctx) => {
  return {
    type: ResultType.Fail,
    expected: [],
    pos: ctx.pos,
  };
};

export function addStmtType<T>(stmtType: StmtType, rule: Rule<T>): Rule<T> {
  const _addStmtType: Rule<T> = (ctx) => {
    const result = rule(ctx);

    for (let i = 0; i < result.expected.length; i += 1) {
      result.expected[i].stmtType = stmtType;
    }

    return result;
  };

  return _addStmtType;
}
