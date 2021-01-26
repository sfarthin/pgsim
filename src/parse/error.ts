import {
  FailResult,
  zeroToMany,
  or,
  whitespace,
  sqlStyleComment,
  cStyleComment,
  identifier,
} from "./util";

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
    if (prefixNumeralLength - (startLine + i).toString().length < 0) {
      return [...new Array(prefixNumeralLength)].map(() => " ").join("");
    }

    const prefixSpaces = [
      ...new Array(prefixNumeralLength - (startLine + i).toString().length),
    ]
      .map(() => " ")
      .join("");

    return `\u001b[34m${prefixSpaces}${startLine + i + 1}\u001b[0m`;
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
          "\u001b[41;1m" +
          s.substring(column.start, column.end) +
          "\u001b[0m" +
          s.substring(column.end)
        );
      }
      return `${printLineNumber(i)}    ${s}`;
    })
    .join("\n");
};

const NUM_CONTEXT_LINES_BEFORE = 4;
const NUM_CONTEXT_LINES_AFTER = 3;

const toLineAndColumn = (str: string, pos: number) => {
  const line = (str.substring(0, pos).match(/\n/g) || []).length;
  const column = str
    .substring(0, pos)
    .split("")
    .reverse()
    .join("")
    .indexOf("\n");

  return { line: line, column: column === -1 ? pos : column };
};

const findNextToken = (str: string, _pos: number) => {
  // Lets ignore whitespace and comments.
  const ctx = {
    pos: _pos,
    str,
    endOfStatement: [],
    startOfNextStatement: [],
  };
  const leadingWhitespace = zeroToMany(
    or([cStyleComment, sqlStyleComment, whitespace])
  )(ctx);

  const afterToken = or([
    identifier, // include whole identifier
  ])({ ...ctx, pos: leadingWhitespace.pos });

  return {
    start: leadingWhitespace.pos,
    end:
      afterToken.pos === leadingWhitespace.pos
        ? afterToken.pos + 1
        : afterToken.pos,
  };
};

/**
 * Prints parser errors nicely
 */
export const getFriendlyErrorMessage = (
  filename: string,
  str: string,
  result: FailResult
): string => {
  // console.log(
  //   result,
  //   toLineAndColumn(str, result.expected[0].pos),
  //   toLineAndColumn(str, result.pos)
  // );

  let expected = result.expected
    .filter(
      (v) =>
        !['"/*"', '"--"', "/[ \\t\\r\\n]/", "/[ \\t\\r]/"].includes(v.value)
    )
    .map((v) => v.value);
  expected = expected.filter((v, i) => expected.indexOf(v) === i).sort();

  const pos = result.expected.length ? result.expected[0].pos : result.pos;

  const message =
    expected.length < 3
      ? `Expected ${expected.join(" or ")}`
      : `Expected one of the following:\n - ${expected.join("\n - ")}`;

  const lines = str.split("\n");
  const nextToken = findNextToken(str, pos);
  const start = toLineAndColumn(str, nextToken.start);
  const end = toLineAndColumn(str, nextToken.end);

  const prefixNumeralLength = end.line.toString().length;

  let error = "";
  error += `Parse error${filename ? ` in ${filename}` : ""}(${start.line + 1},${
    start.column + 1
  }): ${message}\n`;
  error += "\n";
  error +=
    indent({
      lines: lines.slice(start.line - NUM_CONTEXT_LINES_BEFORE, start.line),
      prefixNumeralLength,
      startLine: start.line - NUM_CONTEXT_LINES_BEFORE,
    }) + "\n";
  error +=
    indent({
      lines: [lines[start.line]], // < -- highlight one line at most.
      prefixNumeralLength,
      startLine: start.line,
      highlightColumns: {
        start: start.column,
        end: end.line === start.line ? end.column : 999999, // <-- go to end of line if token spans multiple lines.
      },
    }) + "\n";
  error +=
    indent({
      lines: lines.slice(start.line + 1, start.line + NUM_CONTEXT_LINES_AFTER),
      prefixNumeralLength,
      startLine: start.line + 1,
    }) + "\n";
  error += "\n";

  return error;
};
