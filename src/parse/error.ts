import { FailResult, blockLength, combineBlocks } from "./util";
import c from "ansi-colors";
import { NEWLINE, PrintOptions, toString } from "../format/print";
import { Block } from "~/format/util";

const NUM_CONTEXT_LINES_BEFORE = 1;
const NUM_CONTEXT_LINES_AFTER = 2;

/**
 * Starting at the point we can no longer parse, we create an error token then
 * followed by a number of unknown tokens.
 */
export function toUnknownBlock(
  str: string,
  opts?: { markFirstTokenAsError?: boolean }
): Block {
  return str.split(/\n/).map((line, lineNum) =>
    line
      .replace(/\s+/, "\x01")
      .split("\x01")
      .flatMap((text, tokenNum) => [
        {
          type:
            opts?.markFirstTokenAsError && lineNum === 0 && tokenNum === 0
              ? "error"
              : "unknown",
          text,
        },
        { type: "space" }, // <-- THis adds a space a the end of each line but thats OK
      ])
  );
}

/**
 * Get line, column and string of the error token.
 */
function getErrorDetailsFromBlock(block: Block): {
  line: number;
  column: number;
  token: string;
} {
  let line = 0;
  let column = 0;

  for (const cLine of block) {
    column = 0;
    for (const cToken of cLine) {
      if (cToken.type === "error") {
        return {
          column,
          line,
          token: cToken.text,
        };
      }

      column += "text" in cToken ? cToken.text.length : 1;
    }
    line++;
  }

  throw new Error("No error found");
}

/**
 * Prints parser errors nicely
 */
export const getFriendlyErrorMessage = (
  result: FailResult,
  opts: PrintOptions
): string => {
  const { filename, sql } = opts;

  // See onErrorTryAgainWithExpected
  // We always should have an expected result when we get an error.
  // We may only have it for statement that broke.
  if (!result.expected || !result.expected.length) {
    throw new Error("Internal Error: expected values not present");
  }

  // Get possible strings.
  let expected = result.expected.map((v) => v.value);
  // Remove duplicates
  expected = expected.filter((v, i) => expected.indexOf(v) === i).sort();

  const pos = result.expected[0].pos;
  const lineOffset = opts.sql.substring(0, pos).match(/\n/g)?.length ?? 0;

  const stmtTypes = result.expected.reduce((types, e) => {
    if (e.stmtType && !types.includes(e.stmtType)) {
      return [...types, e.stmtType];
    }
    return types;
  }, [] as string[]);
  const stmtType = stmtTypes.length === 1 ? stmtTypes[0] : null;

  // find the start of the line
  const startOfStmt = pos - blockLength(result.expected[0].tokens as Block);
  let startOfLine = startOfStmt;
  let numprefixedLines = 0;
  while (
    startOfLine > 0 &&
    ((startOfLine !== 0 && sql.charAt(startOfLine) !== "\n") ||
      numprefixedLines < 2)
  ) {
    if (sql.charAt(startOfLine) === "\n") {
      numprefixedLines++;
    }

    startOfLine--;
  }

  const block = combineBlocks(
    combineBlocks(
      // Lets add any text that comes before this statement on this line.
      toUnknownBlock(sql.substring(startOfLine, startOfStmt), {}),
      result.expected[0].tokens
    ),
    toUnknownBlock(sql.substring(pos, pos + 1000), {
      markFirstTokenAsError: true,
    })
  ) as Block;

  const { line, column, token } = getErrorDetailsFromBlock(block);

  const lineToStartPrinting =
    line - NUM_CONTEXT_LINES_BEFORE < 0 ? 0 : line - NUM_CONTEXT_LINES_BEFORE;

  const message =
    expected.length < 3
      ? `Expected ${expected.join(" or ")}, but found "${c.bgRed(
          c.white(token)
        )}"`
      : `Expected one of the following, but found "${c.bgRed(
          c.white(token)
        )}":${NEWLINE} - ${expected.join(`${NEWLINE} - `)}`;

  let error = "";
  error += `${stmtType ? c.cyan(stmtType) : "Parse"} error${
    filename ? ` in ${c.cyan(filename)}` : ""
  }(${c.cyan(String(line + 1 + lineOffset))},${c.cyan(
    String(column + 1)
  )}): ${message} ${NEWLINE}`;
  error += NEWLINE;

  error += toString(block, {
    colors: opts.colors, // <-- Default to what is pased into parser.
    lineNumbers: true,
    startLine: lineToStartPrinting,
    endLine: line + NUM_CONTEXT_LINES_AFTER,
    lineOffset,
  });

  error += NEWLINE;

  return error;
};
