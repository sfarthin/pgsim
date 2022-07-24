import createStmt from "./createStmt";
import variableSetStmt from "./variableSetStmt";
import createEnumStmt from "./createEnumStmt";
import createSeqStmt from "./createSeqStmt";
import alterSeqStmt from "./alterSeqStmt";
import dropStmt from "./dropStmt";
import alterEnumStmt from "./alterEnumStmt";
import alterOwnerStmt from "./alterOwnerStmt";
import alterTableStmt from "./alterTableStmt";
import viewStmt from "./viewStmt";
import selectStmt from "./selectStmt";
import renameStmt from "./renameStmt";
import transactionStmt from "./transactionStmt";

import updateStmt from "./updateStmt";
import { Stmt } from "../types";
import indexStmt from "./indexStmt";
import parse from "../parse";
import { toSingleLineIfPossible, comment, Block } from "./util";
import { toString, PrintOptions, createFriendlyStmtError } from "./print";
import { SuccessResult } from "../parse/util";
import { assertError } from "../assertError";

export { toString } from "./print";

function formatStmt(stmt: Stmt): Block {
  const s = stmt.stmt;

  if ("CreateStmt" in s) {
    return createStmt(s.CreateStmt);
  } else if ("DropStmt" in s) {
    return dropStmt(s.DropStmt);
  } else if ("VariableSetStmt" in s) {
    return variableSetStmt(s.VariableSetStmt);
  } else if ("CreateEnumStmt" in s) {
    return createEnumStmt(s.CreateEnumStmt);
  } else if ("CreateSeqStmt" in s) {
    return createSeqStmt(s.CreateSeqStmt);
  } else if ("AlterSeqStmt" in s) {
    return alterSeqStmt(s.AlterSeqStmt);
  } else if ("AlterEnumStmt" in s) {
    return alterEnumStmt(s.AlterEnumStmt);
  } else if ("AlterOwnerStmt" in s) {
    return alterOwnerStmt(s.AlterOwnerStmt);
  } else if ("IndexStmt" in s) {
    return indexStmt(s.IndexStmt);
  } else if ("AlterTableStmt" in s) {
    return alterTableStmt(s.AlterTableStmt);
  } else if ("Comment" in s) {
    return comment(s.Comment);
  } else if ("SelectStmt" in s) {
    return selectStmt(s.SelectStmt);
  } else if ("ViewStmt" in s) {
    return viewStmt(s.ViewStmt);
  } else if ("RenameStmt" in s) {
    return renameStmt(s.RenameStmt);
  } else if ("UpdateStmt" in s) {
    return updateStmt(s.UpdateStmt);
  } else if ("TransactionStmt" in s) {
    return transactionStmt(s.TransactionStmt);
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}

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
