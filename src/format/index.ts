import createStmt from "./createStmt";
import variableSetStmt from "./variableSetStmt";
import createEnumStmt from "./createEnumStmt";
import createSeqStmt from "./createSeqStmt";
import alterSeqStmt from "./alterSeqStmt";
import dropStmt from "./dropStmt";
import comment from "./comment";
import { Stmt, StatementType } from "~/types";

type Opts = {
  ignore?: StatementType[];
  ignoreAllExcept?: StatementType[];
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
  } else if ("Comment" in s) {
    return comment(s.Comment);
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}

export default function format(stmts: Stmt[], opts?: Opts): string {
  return stmts.map((stmt) => toString(stmt, opts)).join("\n");
}
