import { Stmt } from "~/types";
import parse from "../parse";
import { toSingleLineIfPossible } from "./util";
import { toString, PrintOptions, createFriendlyStmtError } from "./print";
import { SuccessResult } from "../parse/util";
import { assertError } from "../assertError";
import formatStmt from "./stmt";

/**
 * If we already have the parse result, we can
 * pass that in rather than re-parsing it.
 */
export default function format(
  input: SuccessResult<Stmt[]>,
  filename: string,
  opts: Omit<PrintOptions, "filename">
): string;
export default function format(
  input: string,
  filename: string,
  opts?: Omit<PrintOptions, "sql" | "filename">
): string;
export default function format(
  input: string | SuccessResult<Stmt[]>,
  filename = "unknown",
  opts?: Partial<PrintOptions>
): string {
  const result =
    typeof input === "string" ? parse(input, filename, opts) : input;
  const sql = typeof input === "string" ? input : opts?.sql ?? "";

  const codeBlock = result.value.flatMap((stmt, i) => {
    try {
      const formattedStmt = toSingleLineIfPossible(formatStmt(stmt));
      if (i === 0) {
        return formattedStmt;
      } else {
        // Lets add a newline between statements.
        return [[], ...formattedStmt];
      }
    } catch (e) {
      assertError(e);

      throw createFriendlyStmtError(stmt, e, {
        sql,
        filename,
        colors: true,
        ...opts,
      });
    }
  });

  return toString(codeBlock, {
    sql,
    filename,
    ...opts,
  });
}
