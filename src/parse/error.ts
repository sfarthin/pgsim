import { FailResult, blockLength, combineBlocks } from "./util";
import c from "ansi-colors";
import { NEWLINE, PrintOptions, toString } from "../format/print";
import { Block } from "~/format/util";

const NUM_CONTEXT_LINES_BEFORE = 4;
const NUM_CONTEXT_LINES_AFTER = 3;

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

  const stmtType = result.expected[0].stmtType;

  // Sometimes tokens is missing some text. This is a bug I should fix. In the meantime
  // Lets throw this unformatted text in here.
  const missingTextHack = sql.substring(
    blockLength(result.expected[0].tokens as Block) - 1,
    pos
  );

  // We combined what we can parse so far up to the point we cannot parse anymore.
  // We also label the token at this point as an error.
  const block = combineBlocks(
    combineBlocks(result.expected[0].tokens, [
      [{ type: "unknown", text: missingTextHack }],
    ]),
    toUnknownBlock(sql.substring(pos), { markFirstTokenAsError: true })
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
  error += `Parse error${filename ? ` in ${c.cyan(filename)}` : ""}(${c.cyan(
    String(line + 1)
  )},${c.cyan(String(column + 1))}): ${message} in ${c.magenta(
    stmtType ?? "statement"
  )} ${NEWLINE}`;
  error += NEWLINE;

  error += toString(block, {
    colors: opts.colors, // <-- Default to what is pased into parser.
    lineNumbers: true,
    startLine: lineToStartPrinting,
    endLine: line + NUM_CONTEXT_LINES_AFTER,
  });

  error += NEWLINE;

  return error;
};
