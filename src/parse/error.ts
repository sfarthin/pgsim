import { FailResult } from "./util";

const indent = (
  text: string,
  prefixNumeralLength?: number,
  startLine?: number,
  line?: number,
  startColumn?: number,
  endColumn?: number
): string => {
  const printLine = (i: number): string => {
    if (!startLine || !prefixNumeralLength || startLine + i < 0) {
      return [...new Array(prefixNumeralLength)].map(() => " ").join("");
    }

    const prefixSpaces = [
      ...new Array(prefixNumeralLength - (startLine + i).toString().length),
    ]
      .map(() => " ")
      .join("");

    return `\u001b[34m${prefixSpaces}${startLine + i}\u001b[0m`;
  };

  return text
    .split("\n")
    .map((s, i) => {
      if (
        startLine &&
        startColumn &&
        endColumn &&
        line &&
        line === startLine + i
      ) {
        return (
          printLine(i) +
          "    " +
          s.substring(0, startColumn - 1) +
          "\u001b[31m" +
          s.substring(startColumn - 1, endColumn - 1) +
          "\u001b[0m" +
          s.substring(endColumn - 1)
        );
      }
      return `${printLine(i)}    ${s}`;
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

  return { line: line + 1, column: column === -1 ? pos : column };
};

const findNextToken = (str: string, pos: number) => {
  const [whitespace] = str.substring(pos).match(/\s*/) ?? [""];
  const [token] = str.substring(pos).match(/\s*[^\s]+/) ?? [""];

  return { start: pos + whitespace.length, end: pos + token.length };
};

/**
 * Prints parser errors nicely
 */
export const getFriendlyErrorMessage = (
  filename: string,
  str: string,
  result: FailResult
): string => {
  const expected = result.expected.filter(
    (v) => v.type === "keyword" && !['"/*"', '"--"'].includes(v.value)
  );

  console.log(expected);

  const message = `Expected ${expected.map((v) => v.value).join(" or ")}`;

  const lines = str.split("\n");
  const nextToken = findNextToken(str, result.pos);
  const start = toLineAndColumn(str, nextToken.start);
  const end = toLineAndColumn(str, nextToken.end);

  console.log(start, end);

  const before = lines.slice(
    start.line - 1 - NUM_CONTEXT_LINES_BEFORE,
    start.line - 1
  );
  const line = lines[start.line - 1];
  const after = lines.slice(start.line, start.line + NUM_CONTEXT_LINES_AFTER);
  const prefixNumeralLength = start.line.toString().length + 1;
  let error = "";
  error += `Parse error${filename ? ` in ${filename}` : ""}(${start.line},${
    start.column
  }): ${message}\n`;
  error += "\n";
  error +=
    indent(
      before.join("\n"),
      prefixNumeralLength,
      start.line - NUM_CONTEXT_LINES_BEFORE
    ) + "\n";
  error +=
    indent(
      line,
      prefixNumeralLength,
      start.line,
      end.line,
      start.column,
      end.column
    ) + "\n";
  // error +=
  //   indent(
  //     " ".repeat(offset - 1) +
  //       "\u001b[31m" +
  //       "^".repeat(end.line !== start.line ? 1 : end.column - start.column) +
  //       "\u001b[0m",
  //     prefixNumeralLength
  //   ) + "\n";
  error += indent(after.join("\n"), prefixNumeralLength, start.line + 1) + "\n";
  error += "\n";

  return error;
};
