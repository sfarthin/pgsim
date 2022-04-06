/**
 * Prints a CodeBlock to a string
 */

import { Block, Node } from "./util";
import c from "ansi-colors";
import {
  toLineAndColumn,
  getSnippetWithLineNumbers,
  findNextToken,
} from "../parse/error";
import { Stmt } from "../types";

export const NEWLINE = "\n";
export const TAB = "\t";

export type PrintOptions = {
  colors: boolean;
  lineNumbers: boolean;
};

export type FormatDetailsForError = {
  sql?: string; // <-- Original sql before formatting
  filename?: string; // <-- If this comes from a particular file
};

export function createFriendlyStmtError(
  stmt: Stmt,

  // This is the original error thrown
  e: {
    name?: string;
    message?: string;
  },
  opts?: FormatDetailsForError
): unknown {
  const errorType = e.name === "Error" ? "" : `(${e.name})`;
  if (opts?.filename && opts?.sql) {
    // Lets skip over any comments
    const { start: pos } = findNextToken(opts.sql, stmt.stmt_location ?? 0);

    const { line, column } = toLineAndColumn(opts.sql, pos);

    e.name = `Problem formatting${errorType} ${c.cyan(opts.filename)}(${c.cyan(
      String(line + 1)
    )},${c.cyan(String(column + 1))})`;

    e.message = `${e.message}${NEWLINE}${NEWLINE}${getSnippetWithLineNumbers({
      str: opts.sql,
      start: pos,
      end: (stmt.stmt_location ?? 0) + (stmt.stmt_len ?? 20),
    })}${NEWLINE}`;
  } else {
    e.name = `Problem formatting${errorType}`;
    e.message = `${e.message}${NEWLINE}${NEWLINE}${JSON.stringify(
      stmt,
      null,
      2
    )}`;
  }

  return e;
}

function printNode(node: Node, opts: PrintOptions): string {
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
    case "unknown":
      return node.text;
  }
}

export function toString(block: Block, opts: PrintOptions) {
  return block
    .map((line) => line.map((node) => printNode(node, opts)).join(""))
    .join(NEWLINE);
}
