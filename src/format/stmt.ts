import { Stmt } from "~/types";
import { Block } from "./util";
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
import alterDatabaseSetStmt from "./alterDatabaseSetStmt";
import alterDatabaseStmt from "./alterDatabaseStmt";
import updateStmt from "./updateStmt";
import indexStmt from "./indexStmt";
import comment from "./comment";

export default function stmt(stmt: Stmt): Block {
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
  } else if ("AlterDatabaseSetStmt" in s) {
    return alterDatabaseSetStmt(s.AlterDatabaseSetStmt);
  } else if ("AlterDatabaseStmt" in s) {
    return alterDatabaseStmt(s.AlterDatabaseStmt);
  }

  throw new Error(`Cannot format ${Object.keys(s)}`);
}
