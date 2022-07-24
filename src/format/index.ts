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

import updateStmt from "./updateStmt";
import { Stmt } from "../types";
import indexStmt from "./indexStmt";
import parse from "../parse";
import { toSingleLineIfPossible, comment, Block } from "./util";
import {
  toString,
  PrintOptions,
  createFriendlyStmtError,
  FormatDetailsForError,
} from "./print";

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
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}

export default function format(
  _stmts: Stmt[] | string,
  opts?: Partial<PrintOptions> & Partial<FormatDetailsForError>
): string {
  // Parses a string or uses existing AST
  const stmts =
    typeof _stmts === "string"
      ? parse({ str: _stmts, filename: opts?.filename, pos: 0 }).value
      : _stmts;

  const codeBlock = stmts.flatMap((stmt, i) => {
    try {
      const formattedStmt = toSingleLineIfPossible(formatStmt(stmt));
      if (i === 0) {
        return formattedStmt;
      } else {
        // Lets add a newline between statements.
        return [[], ...formattedStmt];
      }
    } catch (e) {
      throw createFriendlyStmtError(
        stmt,
        e as { name?: string; message?: string },
        opts
      );
    }
  });

  return toString(codeBlock, { colors: false, lineNumbers: false, ...opts });
}
