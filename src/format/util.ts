import { NEWLINE } from "./print";

const MAX_INTELIGABLE_LINE = 80;

export type Token =
  | { type: "lineNumber"; text: string } // <-- Only used in printer.
  | { type: "keyword"; text: string } // <-- We can be more specific than "string", reconcile with parser
  // Our formatter only does "sql" type, but when parsing we may come accross the "c" type
  | { type: "comment"; text: string; style: "c" | "sql" }
  | {
      type: "symbol";
      text: string; // <-- We can be more specific than "string", reconcile with parser
    }
  | { type: "identifier"; text: string }
  | { type: "numberLiteral"; text: string }
  | { type: "booleanLiteral"; text: "TRUE" | "FALSE" }
  | { type: "stringLiteral"; text: string }
  | { type: "tab" }
  | { type: "space" }
  // Only used when these is an error.
  | { type: "unknown"; text: string }
  | { type: "error"; text: string };

// spaces and newlines are encoded as a 2-dimensial array;
export type Line = Token[];
export type Block = Line[];
export type TokenType = Token["type"];

export type PartiallyParsedLine = (Token | { type: "unknown"; text: string })[];
export type PartiallyParsedBlock = PartiallyParsedLine[];

export const join = (lines: Block, joinToken: Line): Line =>
  lines.reduce(
    (acc, v, index) =>
      index === lines.length - 1
        ? [...acc, ...v]
        : [...acc, ...v, ...joinToken],
    [] as Line
  );

export const addToLastLine = (lines: Block, addition: Line) => {
  return [...lines.slice(0, -1), [...lines[lines.length - 1], ...addition]];
};

export const addToFirstLine = (addition: Line, lines: Block) => {
  return [[...addition, ...lines[0]], ...lines.slice(1)];
};

export function length(token: Token): number {
  switch (token.type) {
    case "tab":
      return 1;
    case "space":
      return 1;
    default:
      return token.text.length;
  }
}

export function lengthOfBlock(block: Block): number {
  return block.reduce(
    (acc, line) =>
      acc + line.reduce((subAcc, token) => subAcc + length(token), 0),
    0
  );
}

export function doesContainType(block: Block, type: TokenType): boolean {
  return block.some((line) => line.some((token) => token.type === type));
}

export function toSingleLineIfPossible(block: Block): Block {
  if (block.length === 0) {
    return block;
  }

  if (
    block[0].length === 1 &&
    block[0][0].type === "comment" &&
    block.length > 1
  ) {
    return [block[0], ...toSingleLineIfPossible(block.slice(1))];
  }

  if (
    lengthOfBlock(block) < MAX_INTELIGABLE_LINE &&
    // Comments have to have newlines, since they all use the "--" style
    !doesContainType(block, "comment")
  ) {
    const unformattedLine = block
      // Remove newlines
      .flatMap((line) => line.filter((t) => t.type !== "tab").concat(_))
      // flatten it out
      .flat();
    return [
      unformattedLine.reduce((acc, t, i) => {
        if (!acc.length) {
          return [t];
        }

        const lastToken = acc[acc.length - 1];
        const upcomingTokens = unformattedLine.slice(i);

        // If there is only whitespace left on line, trim those.
        const isOnlyWhitespaceLeftOnLine = !upcomingTokens.some(
          (t) => t.type !== "space" && t.type !== "tab"
        );
        if (isOnlyWhitespaceLeftOnLine) {
          return acc;
        }

        // No spaces before certain symbols
        if (
          lastToken.type === "space" &&
          t.type === "symbol" &&
          [",", "::", ";"].includes(t.text)
        ) {
          return [...acc.slice(0, -1), t];
        }

        // Lets make sure there is no space after an open parens/bracket.
        if (
          lastToken.type === "symbol" &&
          ["[", "("].includes(lastToken.text) &&
          t.type === "space"
        ) {
          return acc;
        }

        // Lets make sure we don't have spaces before our end parens/bracket
        if (
          lastToken.type === "space" &&
          t.type === "symbol" &&
          [")", "]"].includes(t.text) // "::", ","
        ) {
          return [...acc.slice(0, -1), t];
        }

        // Lets make sure we don't have duplicate spaces
        if (
          (lastToken.type === "space" || lastToken.type === "tab") &&
          t.type === "space"
        ) {
          return acc;
        }

        // We don't need tabs when we condence to a single line
        if (t.type === "tab") {
          return [...acc, { type: "space" }];
        }

        return [...acc, t];
      }, [] as Line),
    ];
  }

  return block;
}

export function indent(t: Token): Token;
export function indent(t: Block): Block;
export function indent(t: Line): Line;
export function indent(t: any): any {
  // Block
  if (Array.isArray(t) && Array.isArray(t[0])) {
    return (t as Block).map((r) => [{ type: "tab" }, ...r]);
  }

  // Line
  if (Array.isArray(t)) {
    return [{ type: "tab" }, ...t];
  }

  // Token
  return t;
}

const NEEDS_TO_BE_QUOTED = /[^a-z0-9_]/;
export function identifier(c: string): Token {
  return {
    type: "identifier",
    text: NEEDS_TO_BE_QUOTED.test(c) ? `"${c}"` : c,
  };
}

export function symbol(c: string): Token {
  return { type: "symbol", text: c };
}

export function keyword(c: string): Token {
  return { type: "keyword", text: c.toUpperCase() };
}

export const _: Token = { type: "space" };
export const TRUE: Token = { type: "booleanLiteral", text: "TRUE" };
export const FALSE: Token = { type: "booleanLiteral", text: "FALSE" };
export const NULL: Token = { type: "stringLiteral", text: "NULL" };

// We always use sql style comments so we don't have to handle "*/" within comments
// and so we can easilly comment/uncomment.
export function comment(s: string | undefined): Block {
  if (!s) {
    return [];
  }

  const comments: Block = s
    .split(NEWLINE)
    .filter(Boolean)
    .map((line) => [{ type: "comment", text: `-- ${line}`, style: "sql" }]);

  return comments;
}

// export function literal(s: string | number | boolean): Token {
//   if (typeof s === "string") {
//     return { type: "stringLiteral", text: s };
//   }
//   if (typeof s === "number") {
//     return { type: "numberLiteral", text: `${s}` };
//   }
//   if (typeof s === "boolean") {
//     return { type: "booleanLiteral", text: s ? "TRUE" : "FALSE" };
//   }

//   throw new Error(`Not a literal: ${s}`);
// }

export function stringLiteral(s: string): Token {
  return { type: "stringLiteral", text: `'${s.replace("'", "''")}'` };
}

export function integerLiteral(s: number): Token {
  return { type: "numberLiteral", text: `${s}` };
}

export function floatLiteral(s: string): Token {
  return { type: "numberLiteral", text: s };
}
