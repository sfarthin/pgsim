import createStmt from "./createStmt";
import variableSetStmt from "./variableSetStmt";
import createEnumStmt from "./createEnumStmt";
import createSeqStmt from "./createSeqStmt";
import alterSeqStmt from "./alterSeqStmt";
import dropStmt from "./dropStmt";
import alterEnumStmt from "./alterEnumStmt";
import alterOwnerStmt from "./alterOwnerStmt";
import alterTableStmt from "./alterTableStmt";
import selectStmt from "./selectStmt";
import comment from "./comment";
import { Stmt, StatementType } from "../types";
import { toLineAndColumn } from "../parse/error";
import indexStmt from "./indexStmt";

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
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}

export default function format(stmts: Stmt[], opts?: Opts): string {
  return stmts
    .map((stmt) => {
      try {
        return toString(stmt, opts);
      } catch (e) {
        if (opts?.filename && opts?.sql) {
          const { line, column } = toLineAndColumn(
            opts?.sql,
            stmt.RawStmt.stmt_location ?? 0
          );
          e.message = `${opts?.filename}(${line + 1},${column + 1}): ${
            e.message
          }`;
        }

        e.message = `${e.message}\n\n${JSON.stringify(stmt, null, 2)}`;

        // Lets show the statement from the original SQL.
        // Useful in debugging.
        if (opts?.sql) {
          const start = stmt.RawStmt.stmt_location ?? 0;
          const end = stmt.RawStmt.stmt_len ?? 99999;
          const rawSql = opts?.sql.substring(start, start + end);
          e.message = `${e.message}\n\n\u001b[44;1m${rawSql
            .split("\n")
            .map((s) => `\u001b[44;1m${s}\u001b[0m`)
            .join("\n")}`;
        }
        throw e;
      }
    })
    .join("\n");
}
