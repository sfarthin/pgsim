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
import comment from "./comment";
import { Stmt, StatementType } from "../types";
import {
  toLineAndColumn,
  getSnippetWithLineNumbers,
  findNextToken,
} from "../parse/error";
import indexStmt from "./indexStmt";
import parse from "../parse";
import c from "ansi-colors";
import { NEWLINE } from "./whitespace";

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

function toString(stmt: Stmt, opts?: Opts): string {
  const s = stmt.RawStmt.stmt;
  const statementType = Object.keys(s)[0] as StatementType;

  if (opts?.ignore && opts.ignore.includes(statementType)) {
    return `-- Ignoring ${statementType} statements`;
  }

  if (opts?.ignoreAllExcept && !opts.ignoreAllExcept.includes(statementType)) {
    return `-- Ignoring ${statementType} statements`;
  }

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
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}

export default function format(_stmts: Stmt[] | string, opts?: Opts): string {
  const stmts = typeof _stmts === "string" ? parse(_stmts) : _stmts;

  if (stmts.length === 0) {
    return "";
  }

  return stmts
    .map((stmt) => {
      try {
        return toString(stmt, opts);
      } catch (e) {
        const errorType = e.name === "Error" ? "" : `(${e.name})`;
        if (opts?.filename && opts?.sql) {
          // Lets skip over any comments
          const { start: pos } = findNextToken(
            opts.sql,
            stmt.RawStmt.stmt_location ?? 0
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
            end:
              (stmt.RawStmt.stmt_location ?? 0) + (stmt.RawStmt.stmt_len ?? 20),
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
    .join(NEWLINE);
}
