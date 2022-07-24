/**
 * Prints a CodeBlock to a string
 */

import { Block, Token } from "./util";
import c from "ansi-colors";
import { Stmt } from "../types";

export const NEWLINE = "\n";
export const TAB = "\t";

export type PrintOptions = {
  sql: string; // <-- Original sql before formatting
  filename: string; // <-- What file it comes from.
  colors?: boolean;
  lineNumbers?: boolean;
  startLine?: number;
  endLine?: number;
};

export const toLineAndColumn = (str: string, pos: number) => {
  const line = (str.substring(0, pos).match(/\n/g) || []).length;
  const column = str
    .substring(0, pos)
    .split("")
    .reverse()
    .join("")
    .indexOf(NEWLINE);

  return { line: line, column: column === -1 ? pos : column };
};

export function createFriendlyStmtError(
  result: Stmt,
  // This is the original error thrown
  e: Error,
  opts: PrintOptions
): unknown {
  const errorType = e.name === "Error" ? "" : `(${e.name})`;

  const { line, column } = toLineAndColumn(opts.sql, result.stmt_location ?? 0);

  e.name = `Problem formatting${errorType} ${c.cyan(opts.filename)}(${c.cyan(
    String(line + 1)
  )},${c.cyan(String(column + 1))})`;

  // Lets print the one statment we had an issue printing.
  e.message = `${e.message}${NEWLINE}${NEWLINE}${toString(
    result.tokens ?? [],
    opts
  )}${NEWLINE}`;

  return e;
}

function printToken(
  node: Token,
  opts: Omit<PrintOptions, "sql" | "filename">
): string {
  if (node.type === "tab") {
    return TAB;
  }

  if (node.type === "space") {
    return " ";
  }

  if (!opts.colors) {
    return node.text;
  }

  switch (node.type) {
    case "booleanLiteral":
      return c.green(node.text);
    case "numberLiteral":
      return c.green(node.text);
    case "stringLiteral":
      return c.green(node.text);
    case "keyword":
      return c.magenta(node.text);
    case "symbol":
      return c.blue(node.text);
    case "identifier":
      return c.cyan(node.text);
    case "comment":
      return c.grey(node.text);
    case "error":
      return c.bgRed(c.white(node.text));
    case "lineNumber":
      return c.grey(node.text);
    case "unknown":
      return c.grey(node.text);
  }
}

export function toString(
  _block: Block,
  opts: Omit<PrintOptions, "sql" | "filename">
) {
  let block = _block;

  if (opts.startLine || opts.endLine) {
    block = block.slice(opts.startLine ?? 0, opts.endLine);
  }

  if (opts.lineNumbers) {
    const longestLineNumberLength = `${
      opts.endLine ?? block.length + (opts.startLine ?? 0)
    }`.length;

    block = block.map((line, index) => {
      const lineNumber = index + 1 + (opts.startLine ?? 0);

      const prefixSpaces = [
        ...new Array(
          longestLineNumberLength -
            ((opts.startLine ?? 0) + index + 1).toString().length
        ),
      ]
        .map(() => " ")
        .join("");

      return [
        {
          type: "lineNumber",
          text: `${prefixSpaces}${lineNumber}   `,
        },
        ...line,
      ];
    });
  }

  return block
    .map((line) => line.map((token) => printToken(token, opts)).join(""))
    .join(NEWLINE);
}
