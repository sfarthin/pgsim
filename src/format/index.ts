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
import comment from "./comment";
import updateStmt from "./updateStmt";
import { Stmt, StatementType } from "../types";
import {
  toLineAndColumn,
  getSnippetWithLineNumbers,
  findNextToken,
} from "../parse/error";
import indexStmt from "./indexStmt";
import parse from "../parse";
import c from "ansi-colors";
import { NEWLINE, textFormatter, Formatter } from "./util";

type Opts = {
  ignore?: StatementType[];
  ignoreAllExcept?: StatementType[];
  sql?: string; // <-- Original sql before formatting. useful when there is an error.
  filename?: string;
};

// const schemaStatements: StatementType[] = [
//   "CreateStmt",
//   "AlterTableStmt",
//   "CreateSeqStmt",
//   "VariableSetStmt",
//   "CreateEnumStmt",
//   "AlterSeqStmt",
//   "IndexStmt",
//   "CommentStmt",
// ];

function formatStmt<T>(stmt: Stmt, f: Formatter<T>, opts?: Opts): T[][] {
  const s = stmt.stmt;
  const statementType = Object.keys(s)[0] as StatementType;

  if (opts?.ignore && opts.ignore.includes(statementType)) {
    return comment(`-- Ignoring ${statementType} statements`, f);
  }

  if (opts?.ignoreAllExcept && !opts.ignoreAllExcept.includes(statementType)) {
    return comment(`-- Ignoring ${statementType} statements`, f);
  }

  if ("CreateStmt" in s) {
    return createStmt(s.CreateStmt, f);
  } else if ("DropStmt" in s) {
    return dropStmt(s.DropStmt, f);
  } else if ("VariableSetStmt" in s) {
    return variableSetStmt(s.VariableSetStmt, f);
  } else if ("CreateEnumStmt" in s) {
    return createEnumStmt(s.CreateEnumStmt, f);
  } else if ("CreateSeqStmt" in s) {
    return createSeqStmt(s.CreateSeqStmt, f);
  } else if ("AlterSeqStmt" in s) {
    return alterSeqStmt(s.AlterSeqStmt, f);
  } else if ("AlterEnumStmt" in s) {
    return alterEnumStmt(s.AlterEnumStmt, f);
  } else if ("AlterOwnerStmt" in s) {
    return alterOwnerStmt(s.AlterOwnerStmt, f);
  } else if ("IndexStmt" in s) {
    return indexStmt(s.IndexStmt, f);
  } else if ("AlterTableStmt" in s) {
    return alterTableStmt(s.AlterTableStmt, f);
  } else if ("Comment" in s) {
    return comment(s.Comment, f);
  } else if ("SelectStmt" in s) {
    return selectStmt(s.SelectStmt, f);
  } else if ("ViewStmt" in s) {
    return viewStmt(s.ViewStmt, f);
  } else if ("RenameStmt" in s) {
    return renameStmt(s.RenameStmt, f);
  } else if ("UpdateStmt" in s) {
    return updateStmt(s.UpdateStmt, f);
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}

export default function format(_stmts: Stmt[] | string, opts?: Opts): string {
  const stmts = typeof _stmts === "string" ? parse(_stmts) : _stmts;
  const f = textFormatter;

  if (stmts.length === 0) {
    return "";
  }

  return stmts
    .map((stmt) => {
      try {
        return f.concat(formatStmt(stmt, f, opts));
      } catch (_e) {
        const e = _e as { name?: string; message?: string };
        const errorType = e.name === "Error" ? "" : `(${e.name})`;
        if (opts?.filename && opts?.sql) {
          // Lets skip over any comments
          const { start: pos } = findNextToken(
            opts.sql,
            stmt.stmt_location ?? 0
          );

          const { line, column } = toLineAndColumn(opts.sql, pos);

          e.name = `Problem formatting${errorType} ${c.cyan(
            opts.filename
          )}(${c.cyan(String(line + 1))},${c.cyan(String(column + 1))})`;

          e.message = `${
            e.message
          }${NEWLINE}${NEWLINE}${getSnippetWithLineNumbers({
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
        throw e;
      }
    })
    .join(`${NEWLINE}${NEWLINE}`);
}
