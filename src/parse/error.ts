import {
  FailResult,
  zeroToMany,
  or,
  whitespace,
  sqlStyleComment,
  cStyleComment,
  regexChar,
} from "./util";
import { Stmt } from "../types";
import c from "ansi-colors";
import { NEWLINE } from "../format/print";

const indent = ({
  lines,
  prefixNumeralLength,
  startLine,
  highlightColumns,
}: {
  lines: string[];
  prefixNumeralLength: number;
  startLine: number;
  highlightColumns?: {
    start: number;
    end: number;
  };
}): string => {
  const printLineNumber = (i: number): string => {
    if (prefixNumeralLength - (startLine + i + 1).toString().length < 0) {
      return [...new Array(prefixNumeralLength)].map(() => " ").join("");
    }

    const prefixSpaces = [
      ...new Array(prefixNumeralLength - (startLine + i + 1).toString().length),
    ]
      .map(() => " ")
      .join("");

    return c.green(`${prefixSpaces}${startLine + i + 1}`);
  };

  return lines
    .map((s, i) => {
      if (highlightColumns) {
        const column = highlightColumns;
        // We never want to highlight more than one line.
        // so we will start at the start line and go to the end column or
        // end of the line, whichever comes first.
        return (
          printLineNumber(i) +
          "    " +
          s.substring(0, column.start) +
          c.red(s.substring(column.start, column.end)) +
          s.substring(column.end)
        );
      }
      return `${printLineNumber(i)}    ${s}`;
    })
    .join(NEWLINE);
};

const NUM_CONTEXT_LINES_BEFORE = 4;
const NUM_CONTEXT_LINES_AFTER = 3;

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

export const findNextToken = (str: string, _pos: number) => {
  // Lets ignore whitespace and comments.
  const ctx = {
    pos: _pos,
    str,
  };
  const leadingWhitespace = zeroToMany(
    or([cStyleComment, sqlStyleComment, whitespace])
  )(ctx);

  const afterToken = zeroToMany(regexChar(/[a-zA-Z0-9_]/))({
    ...ctx,
    pos: leadingWhitespace.pos ?? _pos,
  });

  return {
    start: leadingWhitespace.pos ?? _pos,
    end:
      afterToken.pos === leadingWhitespace.pos
        ? afterToken.pos + 1
        : afterToken.pos,
  };
};

export const getSnippetWithLineNumbers = ({
  str,
  start,
  end,
}: {
  str: string;
  start: number;
  end: number;
}): string => {
  const { line } = toLineAndColumn(str, start);
  const { line: endLine } = toLineAndColumn(str, end);

  // i.e. 10 => 2 ... 8 => 1 ... number of spaces needed to print the number
  // remember length is one more than the last number
  const prefixNumeralLength = line.toString().length + 1;
  const lines = str.split(NEWLINE);

  return indent({
    lines: lines.slice(line, endLine + 1),
    prefixNumeralLength,
    startLine: line,
  });
};

/**
 * Prints parser errors nicely
 */
export const getFriendlyErrorMessage = ({
  filename,
  str,
  result,
  expectedAst,
}: {
  filename: string;
  str: string;
  result: FailResult;
  expectedAst?: Stmt | undefined;
}): string => {
  let expected = result.expected.map((v) => v.value);
  expected = expected.filter((v, i) => expected.indexOf(v) === i).sort();

  const pos = result.expected.length ? result.expected[0].pos : result.pos;

  const lines = str.split(NEWLINE);
  const nextToken = findNextToken(str, pos);
  const start = toLineAndColumn(str, nextToken.start);
  const end = toLineAndColumn(str, nextToken.end);

  const tokenStr = str.substring(nextToken.start, nextToken.end);

  const message =
    expected.length < 3
      ? `Expected ${expected.join(" or ")}, but found ${tokenStr}`
      : `Expected one of the following, but found "${tokenStr}":${NEWLINE} - ${expected.join(
          `${NEWLINE} - `
        )}`;

  const prefixNumeralLength = end.line.toString().length;

  let error = "";
  error += `Parse error${filename ? ` in ${c.cyan(filename)}` : ""}(${c.cyan(
    String(start.line + 1)
  )},${c.cyan(String(start.column + 1))}): ${message}${NEWLINE}`;
  error += NEWLINE;

  const lineToStartPrinting =
    start.line - NUM_CONTEXT_LINES_BEFORE < 0
      ? 0
      : start.line - NUM_CONTEXT_LINES_BEFORE;
  error +=
    indent({
      lines: lines.slice(lineToStartPrinting, start.line),
      prefixNumeralLength,
      startLine: lineToStartPrinting,
    }) + NEWLINE;
  error +=
    indent({
      lines: [lines[start.line]], // < -- highlight one line at most.
      prefixNumeralLength,
      startLine: start.line,
      highlightColumns: {
        start: start.column,
        end: end.line === start.line ? end.column : 999999, // <-- go to end of line if token spans multiple lines.
      },
    }) + NEWLINE;
  error +=
    indent({
      lines: lines.slice(start.line + 1, start.line + NUM_CONTEXT_LINES_AFTER),
      prefixNumeralLength,
      startLine: start.line + 1,
    }) + NEWLINE;
  if (expectedAst) {
    error += `${NEWLINE}${NEWLINE}${JSON.stringify(expectedAst.stmt, null, 2)}`;
  }
  error += NEWLINE;

  return error;
};
