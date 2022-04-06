/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeNameKeyword } from "src/types";
import { NEWLINE, TAB } from "../format/print";
import { Node, Block } from "../format/util";
import { expectedReducer } from "./expectedReducer";
import { or } from "./or";
import { sequence } from "./sequence";

export { or } from "./or";
export { sequence } from "./sequence";
/**
 * Types
 */

// unformatted SQL may have arbitrary newlines. Our formatter has consistent newliens and do not need this Node
export type UnformattedNode = Node | { type: "newline" };

export enum ResultType {
  Fail = "___FAIL___",
  Success = "___SUCCESS___",
}

// Todo reconcile this more with Nodes
export type Expected =
  | { type: "keyword"; value: string; pos: number }
  | { type: "notKeyword"; value: string; pos: number }
  | { type: "regex"; value: string; pos: number }
  | { type: "identifier"; value: string; pos: number }
  | { type: "endOfInput"; value: string; pos: number };

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
  SuccessResultBase<R> & { nodes: UnformattedNode[] };

type SuccessBufferResult<R> = SuccessResultBase<R> & { buffer: string };

export type FailResult = {
  type: ResultType.Fail;
  expected: Expected[];
  /**
   * The ending location where the parser could no longer parse
   */
  pos: number;

  nodes: UnformattedNode[];
};

export type RuleResult<R> = FailResult | SuccessResult<R>;
type BufferRuleResult<R> = FailResult | SuccessBufferResult<R>;

export type Context = {
  /**
   * Filename of SQL file
   */
  filename?: string;

  /**
   * Original SQL
   */
  str: string;

  /**
   * position we have parsed so far
   */
  pos: number;

  /**
   * Number of statements we have encountered.
   * This is only useful to reconcile which statement we failed to parse and expected parse statements when testing.
   */
  numStatements?: number;
};

export type Rule<R> = (c: Context) => RuleResult<R>;

// TODO Type Buffer and Node Rule seperately.
// use generics one methods that can be both.
export type BufferRule<R> = (s: Context) => BufferRuleResult<R>;

export type EitherRule<R> = (c: Context) => RuleResult<R> | BufferRuleResult<R>;

export function toBlock(nodes: UnformattedNode[]): Block {
  const block: Block = [[]];
  let line = 0;
  for (const node of nodes) {
    if (node.type === "newline") {
      line++;
      block.push([]);
    } else {
      block[line].push(node);
    }
  }

  return block;
}

export const placeholder: Rule<null> = (ctx) => ({
  type: ResultType.Success,
  value: null,
  expected: [],
  length: 0,
  pos: ctx.pos,
  nodes: [],
});

export const endOfInput: Rule<number> = (ctx) => {
  if (ctx.pos == ctx.str.length) {
    return {
      type: ResultType.Success,
      value: ctx.pos,
      length: 0, // <-- unlike most rules, this one does not progress the position
      expected: [],
      pos: ctx.pos,
      nodes: [],
    };
  }

  return {
    type: ResultType.Fail,
    expected: [{ type: "endOfInput", value: "End of Input", pos: ctx.pos }],
    pos: ctx.pos,
    nodes: [],
  };
};

const endOfInputBuffer: BufferRule<number> = (ctx) => {
  if (ctx.pos == ctx.str.length) {
    return {
      type: ResultType.Success,
      value: ctx.pos,
      length: 0, // <-- unlike most rules, this one does not progress the position
      expected: [],
      pos: ctx.pos,
      buffer: "",
    };
  }

  return {
    type: ResultType.Fail,
    expected: [{ type: "endOfInput", value: "End of Input", pos: ctx.pos }],
    pos: ctx.pos,
    nodes: [],
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
        pos: ctx.pos,
        buffer: potentialKeyword,
      };
    }

    return {
      type: ResultType.Fail,
      expected: [
        {
          type: "keyword",
          value: `"${keyword}"`,
          pos: ctx.pos,
        },
      ],
      pos: ctx.pos,
      nodes: [],
    };
  };

  return rule;
}

export const symbol = (keyword: string) =>
  toNodes(constant(keyword), (buffer) => [{ type: "symbol", text: buffer }]);

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
        buffer: char,
      };
    }
    return {
      type: ResultType.Fail,
      expected: [{ type: "regex", value: r.toString(), pos }],
      pos,
      nodes: [],
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
  const newRule: EitherRule<T[]> = (ctx: Context) => {
    let curr;
    const start = ctx.pos;
    let pos = ctx.pos;
    const values = [];
    let expected: Expected[] = [];
    let lastPos = pos;

    // It can be one or the other.
    let nodes: UnformattedNode[] = [];
    let buffer = "";
    while (pos < ctx.str.length && (max === null || values.length < max)) {
      curr = rule({ ...ctx, pos });
      expected = expected.concat(curr.expected).reduce(expectedReducer, []);

      if (curr.type === ResultType.Success) {
        if ("nodes" in curr) {
          nodes = [...nodes, ...curr.nodes];
        } else {
          buffer = `${buffer}${curr.buffer}`;
        }

        pos += curr.length;
        values.push(curr.value);
      } else {
        lastPos = curr.pos;
        break;
      }
    }

    if (nodes.length && buffer.length) {
      throw new Error(
        `Invalid expression, expression must be nodes or buffer: ${nodes.length},${buffer.length}`
      );
    }

    if (values.length < min) {
      return {
        type: ResultType.Fail,
        expected,
        pos: lastPos,
        ...(nodes.length ? { nodes } : { nodes: [] }),
      };
    }

    return {
      type: ResultType.Success,
      value: values,
      length: pos - start,
      expected,
      pos: lastPos,
      ...(nodes.length ? { nodes } : { buffer }),
    };
  };

  return newRule;
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
  toNodes(regexChar(/[ \t\r\n]/), (str) => {
    return [
      str === " "
        ? { type: "space" }
        : str === TAB
        ? { type: "tab" }
        : { type: "newline" },
    ];
  }),
  () => null
);
export const whitespaceWithoutNewline = toNodes(regexChar(/[ \t\r]/), (str) => [
  str === " " ? { type: "space" } : { type: "tab" },
]);

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
        pos: ctx.pos,
        buffer: ctx.str.charAt(ctx.pos),
      };
    }

    return {
      type: ResultType.Fail,
      expected: [
        {
          type: "notKeyword",
          value: `not "${keyword}"`,
          pos: ctx.pos,
        },
      ],
      pos: ctx.pos,
      nodes: [],
    };
  };

  return rule;
}

export function transform<T, R>(
  rule: BufferRule<T>,
  transform: (i: T, c: Context) => R
): BufferRule<R>;
export function transform<T, R>(
  rule: Rule<T>,
  transform: (i: T, c: Context) => R
): Rule<R>;
export function transform<T, R>(
  rule: EitherRule<T>,
  transform: (i: T, c: Context) => R
): EitherRule<R> {
  const newRule: EitherRule<R> = (ctx) => {
    const result = rule(ctx);
    if (result.type === ResultType.Success) {
      return {
        ...result,
        value: transform(result.value, ctx),
      };
    }
    return result;
  };

  return newRule;
}

export function toNodes<T>(
  rule: BufferRule<T>,
  func: (buffer: string) => UnformattedNode[]
): Rule<T> {
  const newRule: Rule<T> = (ctx) => {
    const result = rule(ctx);

    if (result.type === ResultType.Success) {
      const { buffer, ...everythingButBuffer } = result;
      return {
        ...everythingButBuffer,
        nodes: func(buffer ?? ""),
      };
    } else {
      return {
        ...result,
        nodes: [],
      };
    }
  };

  return newRule;
}

export function combineComments(...c: (string | null | undefined)[]) {
  return c
    .filter(Boolean)
    .map((s) => s ?? "")
    .join(NEWLINE);
}

export const cStyleComment: Rule<string> = toNodes(
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
      {
        type: "comment",
        text: buffer,
        style: "c",
      },
    ];
  }
);

export const cStyleCommentWithoutNewline: Rule<string> = toNodes(
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
    {
      type: "comment",
      text: buffer,
      style: "c",
    },
  ]
);

export const sqlStyleComment: Rule<string> = toNodes(
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
          {
            type: "comment",
            text: buffer.substring(0, buffer.length - 1),
            style: "sql",
          },
          { type: "newline" },
        ]
      : [
          {
            type: "comment",
            text: buffer,
            style: "sql",
          },
        ]
);

export const sqlStyleCommentWithoutNewline: Rule<string> = toNodes(
  transform(
    sequence([
      constant("--"),
      zeroToOne(regexChar(/[ \t\r\n]/)),
      zeroToMany(notConstant(NEWLINE)),
    ]),
    (v) => combineComments(v[2].join(""))
  ),
  (buffer) => [
    {
      type: "comment",
      text: buffer,
      style: "sql",
    },
  ]
);

export function lookAhead<T>(rule: Rule<T>): Rule<T> {
  const newRule: Rule<T> = (ctx: Context) => {
    const curr = rule(ctx);

    if (curr.type === ResultType.Success) {
      return {
        ...curr,
        type: ResultType.Success,
        value: curr.value,
        length: 0, // <-- unlike most rules, this one does not progress the position
        expected: [],
        pos: ctx.pos,
        nodes: [],
      };
    }

    return curr;
  };

  return newRule;
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
  "AND",
  "ACTION",
  "ADD",
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
  "CREATE",
  "CYCLE",
  // "DEFAULT",
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
  "IF",
  "IN",
  "INCREMENT",
  "INDEX",
  "INNER",
  "JOIN",
  "KEY",
  "LEFT",
  "MAXVALUE",
  "MINVALUE",
  "NO",
  "NONE",
  "NOT",
  "IS",
  // "NULL",
  "ON",
  "OR",
  "ORDER",
  "ONLY",
  "OWNED",
  "OWNER",
  "PRIMARY",
  "REFERENCES",
  "RENAME",
  "RESTRICT",
  "RIGHT",
  "SEQUENCE",
  "SET",
  "SELECT",
  "START",
  "TABLE",
  "TO",
  "THEN",
  "UNIQUE",
  "UPDATE",
  "USING",
  "VALUE",
  "VIEW",
  "WITH",
  "WHERE",
  "WHEN",
] as const;

export function keyword(
  str: typeof keywordList[number] | TypeNameKeyword
): Rule<{ start: number; value: string }> {
  return (ctx) => {
    const result = transform(
      sequence([
        toNodes(constant(str), (text) => [{ type: "keyword", text }]),
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

    result.expected =
      result.type === ResultType.Success
        ? []
        : [{ type: "keyword", value: `"${str}"`, pos: ctx.pos }];

    return result;
  };
}

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
export const BY = keyword("BY");
export const CACHE = keyword("CACHE");
export const CASCADE = keyword("CASCADE");
export const CASE = keyword("CASE");
export const CONCURRENTLY = keyword("CONCURRENTLY");
export const CONSTRAINT = keyword("CONSTRAINT" as any); // <-- exeption for Truebill
export const COLUMN = keyword("COLUMN");
export const CREATE = keyword("CREATE");
export const CYCLE = keyword("CYCLE");
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
export const IN = keyword("IN");
export const IF = keyword("IF");
export const INCREMENT = keyword("INCREMENT");
export const INDEX = keyword("INDEX");
export const INNER = keyword("INNER");
export const JOIN = keyword("JOIN");
export const KEY = keyword("KEY");
export const LEFT = keyword("LEFT");
export const MAXVALUE = keyword("MAXVALUE");
export const MINVALUE = keyword("MINVALUE");
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
export const RESTRICT = keyword("RESTRICT");
export const SEQUENCE = keyword("SEQUENCE");
export const SELECT = keyword("SELECT");
export const SET = keyword("SET");
export const START = keyword("START");
export const TABLE = keyword("TABLE");
export const TO = keyword("TO");
export const THEN = keyword("THEN");
export const TYPE = keyword("TYPE" as any); // <-- One exeption where we can use it ad an identifier
export const UNIQUE = keyword("UNIQUE");
export const USING = keyword("USING");
export const VALUE = keyword("VALUE");
export const VIEW = keyword("VIEW");
export const WITH = keyword("WITH");
export const WHERE = keyword("WHERE");
export const WHEN = keyword("WHEN");

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

export const identifier: Rule<string> = (ctx: Context) => {
  const result = toNodes(
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
      return [{ type: "identifier", text }];
    }
  )(ctx);

  if (!("nodes" in result)) {
    throw new Error("Lets make TS happy");
  }

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
      nodes: result.nodes,
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

export const integer = toNodes(
  transform(oneToMany(regexChar(/[0-9]/)), (s) => Number(s.join(""))),
  (text) => [{ type: "numberLiteral", text }]
);

export const float = toNodes(
  transform(
    sequence([
      oneToMany(regexChar(/[0-9]/)),
      constant("."),
      oneToMany(regexChar(/[0-9]/)),
    ]),
    (s) => `${s[0].join("")}.${s[2].join("")}`
  ),
  (text) => {
    return [{ type: "numberLiteral", text }];
  }
);

/**
 * Common
 */

export const quotedString = toNodes(
  transform(
    sequence([constant("'"), zeroToMany(notConstant("'")), constant("'")]),
    (v, ctx) => ({ value: v[1].join(""), pos: ctx.pos })
  ),
  (text) => [
    { type: "stringLiteral", text: text.substring(1, text.length - 1) },
  ]
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
    zeroToMany(
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
  const newRule: Rule<T | null> = or([rule, placeholder]);
  return newRule;
}
