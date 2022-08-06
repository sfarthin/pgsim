/**
 * This file was generated, DO NOT EDIT directly. See ./scaffold or run pgsim-scaffold
 **/
import { Stmt } from "~/types";
import { Block } from "./util";
import alterDatabaseSetStmt from "./alterDatabaseSetStmt";
import alterDatabaseStmt from "./alterDatabaseStmt";
import alterDefaultPrivilegesStmt from "./alterDefaultPrivilegesStmt";
import alterEnumStmt from "./alterEnumStmt";
import alterFunctionStmt from "./alterFunctionStmt";
import alterObjectSchemaStmt from "./alterObjectSchemaStmt";
import alterOperatorStmt from "./alterOperatorStmt";
import alterOpFamilyStmt from "./alterOpFamilyStmt";
import alterOwnerStmt from "./alterOwnerStmt";
import alterRoleSetStmt from "./alterRoleSetStmt";
import alterRoleStmt from "./alterRoleStmt";
import alterSeqStmt from "./alterSeqStmt";
import alterTableStmt from "./alterTableStmt";
import alterTsConfigurationStmt from "./alterTsConfigurationStmt";
import alterTsDictionaryStmt from "./alterTsDictionaryStmt";
import closePortalStmt from "./closePortalStmt";
import clusterStmt from "./clusterStmt";
import commentStmt from "./commentStmt";
import compositeTypeStmt from "./compositeTypeStmt";
import copyStmt from "./copyStmt";
import createCastStmt from "./createCastStmt";
import createConversionStmt from "./createConversionStmt";
import createDomainStmt from "./createDomainStmt";
import createEnumStmt from "./createEnumStmt";
import createEventTrigStmt from "./createEventTrigStmt";
import createFdwStmt from "./createFdwStmt";
import createForeignServerStmt from "./createForeignServerStmt";
import createFunctionStmt from "./createFunctionStmt";
import createOpClassStmt from "./createOpClassStmt";
import createOpFamilyStmt from "./createOpFamilyStmt";
import createPLangStmt from "./createPLangStmt";
import createPolicyStmt from "./createPolicyStmt";
import createRangeStmt from "./createRangeStmt";
import createRoleStmt from "./createRoleStmt";
import createSchemaStmt from "./createSchemaStmt";
import createSeqStmt from "./createSeqStmt";
import createStatsStmt from "./createStatsStmt";
import createStmt from "./createStmt";
import createTableAsStmt from "./createTableAsStmt";
import createTrigStmt from "./createTrigStmt";
import deallocateStmt from "./deallocateStmt";
import declareCursorStmt from "./declareCursorStmt";
import defineStmt from "./defineStmt";
import deleteStmt from "./deleteStmt";
import discardStmt from "./discardStmt";
import doStmt from "./doStmt";
import dropRoleStmt from "./dropRoleStmt";
import dropStmt from "./dropStmt";
import executeStmt from "./executeStmt";
import explainStmt from "./explainStmt";
import fetchStmt from "./fetchStmt";
import grantStmt from "./grantStmt";
import indexStmt from "./indexStmt";
import insertStmt from "./insertStmt";
import listenStmt from "./listenStmt";
import lockStmt from "./lockStmt";
import notifyStmt from "./notifyStmt";
import prepareStmt from "./prepareStmt";
import reindexStmt from "./reindexStmt";
import renameStmt from "./renameStmt";
import ruleStmt from "./ruleStmt";
import secLabelStmt from "./secLabelStmt";
import selectStmt from "./selectStmt";
import transactionStmt from "./transactionStmt";
import truncateStmt from "./truncateStmt";
import unlistenStmt from "./unlistenStmt";
import updateStmt from "./updateStmt";
import vacuumStmt from "./vacuumStmt";
import variableSetStmt from "./variableSetStmt";
import variableShowStmt from "./variableShowStmt";
import viewStmt from "./viewStmt";
import comment from "./comment";

export default function stmt(stmt: Stmt): Block {
  const s = stmt.stmt;

  if ("AlterDatabaseSetStmt" in s) {
    return alterDatabaseSetStmt(s.AlterDatabaseSetStmt);
  } else if ("AlterDatabaseStmt" in s) {
    return alterDatabaseStmt(s.AlterDatabaseStmt);
  } else if ("AlterDefaultPrivilegesStmt" in s) {
    return alterDefaultPrivilegesStmt(s.AlterDefaultPrivilegesStmt);
  } else if ("AlterEnumStmt" in s) {
    return alterEnumStmt(s.AlterEnumStmt);
  } else if ("AlterFunctionStmt" in s) {
    return alterFunctionStmt(s.AlterFunctionStmt);
  } else if ("AlterObjectSchemaStmt" in s) {
    return alterObjectSchemaStmt(s.AlterObjectSchemaStmt);
  } else if ("AlterOperatorStmt" in s) {
    return alterOperatorStmt(s.AlterOperatorStmt);
  } else if ("AlterOpFamilyStmt" in s) {
    return alterOpFamilyStmt(s.AlterOpFamilyStmt);
  } else if ("AlterOwnerStmt" in s) {
    return alterOwnerStmt(s.AlterOwnerStmt);
  } else if ("AlterRoleSetStmt" in s) {
    return alterRoleSetStmt(s.AlterRoleSetStmt);
  } else if ("AlterRoleStmt" in s) {
    return alterRoleStmt(s.AlterRoleStmt);
  } else if ("AlterSeqStmt" in s) {
    return alterSeqStmt(s.AlterSeqStmt);
  } else if ("AlterTableStmt" in s) {
    return alterTableStmt(s.AlterTableStmt);
  } else if ("AlterTSConfigurationStmt" in s) {
    return alterTsConfigurationStmt(s.AlterTSConfigurationStmt);
  } else if ("AlterTSDictionaryStmt" in s) {
    return alterTsDictionaryStmt(s.AlterTSDictionaryStmt);
  } else if ("ClosePortalStmt" in s) {
    return closePortalStmt(s.ClosePortalStmt);
  } else if ("ClusterStmt" in s) {
    return clusterStmt(s.ClusterStmt);
  } else if ("CommentStmt" in s) {
    return commentStmt(s.CommentStmt);
  } else if ("CompositeTypeStmt" in s) {
    return compositeTypeStmt(s.CompositeTypeStmt);
  } else if ("CopyStmt" in s) {
    return copyStmt(s.CopyStmt);
  } else if ("CreateCastStmt" in s) {
    return createCastStmt(s.CreateCastStmt);
  } else if ("CreateConversionStmt" in s) {
    return createConversionStmt(s.CreateConversionStmt);
  } else if ("CreateDomainStmt" in s) {
    return createDomainStmt(s.CreateDomainStmt);
  } else if ("CreateEnumStmt" in s) {
    return createEnumStmt(s.CreateEnumStmt);
  } else if ("CreateEventTrigStmt" in s) {
    return createEventTrigStmt(s.CreateEventTrigStmt);
  } else if ("CreateFdwStmt" in s) {
    return createFdwStmt(s.CreateFdwStmt);
  } else if ("CreateForeignServerStmt" in s) {
    return createForeignServerStmt(s.CreateForeignServerStmt);
  } else if ("CreateFunctionStmt" in s) {
    return createFunctionStmt(s.CreateFunctionStmt);
  } else if ("CreateOpClassStmt" in s) {
    return createOpClassStmt(s.CreateOpClassStmt);
  } else if ("CreateOpFamilyStmt" in s) {
    return createOpFamilyStmt(s.CreateOpFamilyStmt);
  } else if ("CreatePLangStmt" in s) {
    return createPLangStmt(s.CreatePLangStmt);
  } else if ("CreatePolicyStmt" in s) {
    return createPolicyStmt(s.CreatePolicyStmt);
  } else if ("CreateRangeStmt" in s) {
    return createRangeStmt(s.CreateRangeStmt);
  } else if ("CreateRoleStmt" in s) {
    return createRoleStmt(s.CreateRoleStmt);
  } else if ("CreateSchemaStmt" in s) {
    return createSchemaStmt(s.CreateSchemaStmt);
  } else if ("CreateSeqStmt" in s) {
    return createSeqStmt(s.CreateSeqStmt);
  } else if ("CreateStatsStmt" in s) {
    return createStatsStmt(s.CreateStatsStmt);
  } else if ("CreateStmt" in s) {
    return createStmt(s.CreateStmt);
  } else if ("CreateTableAsStmt" in s) {
    return createTableAsStmt(s.CreateTableAsStmt);
  } else if ("CreateTrigStmt" in s) {
    return createTrigStmt(s.CreateTrigStmt);
  } else if ("DeallocateStmt" in s) {
    return deallocateStmt(s.DeallocateStmt);
  } else if ("DeclareCursorStmt" in s) {
    return declareCursorStmt(s.DeclareCursorStmt);
  } else if ("DefineStmt" in s) {
    return defineStmt(s.DefineStmt);
  } else if ("DeleteStmt" in s) {
    return deleteStmt(s.DeleteStmt);
  } else if ("DiscardStmt" in s) {
    return discardStmt(s.DiscardStmt);
  } else if ("DoStmt" in s) {
    return doStmt(s.DoStmt);
  } else if ("DropRoleStmt" in s) {
    return dropRoleStmt(s.DropRoleStmt);
  } else if ("DropStmt" in s) {
    return dropStmt(s.DropStmt);
  } else if ("ExecuteStmt" in s) {
    return executeStmt(s.ExecuteStmt);
  } else if ("ExplainStmt" in s) {
    return explainStmt(s.ExplainStmt);
  } else if ("FetchStmt" in s) {
    return fetchStmt(s.FetchStmt);
  } else if ("GrantStmt" in s) {
    return grantStmt(s.GrantStmt);
  } else if ("IndexStmt" in s) {
    return indexStmt(s.IndexStmt);
  } else if ("InsertStmt" in s) {
    return insertStmt(s.InsertStmt);
  } else if ("ListenStmt" in s) {
    return listenStmt(s.ListenStmt);
  } else if ("LockStmt" in s) {
    return lockStmt(s.LockStmt);
  } else if ("NotifyStmt" in s) {
    return notifyStmt(s.NotifyStmt);
  } else if ("PrepareStmt" in s) {
    return prepareStmt(s.PrepareStmt);
  } else if ("ReindexStmt" in s) {
    return reindexStmt(s.ReindexStmt);
  } else if ("RenameStmt" in s) {
    return renameStmt(s.RenameStmt);
  } else if ("RuleStmt" in s) {
    return ruleStmt(s.RuleStmt);
  } else if ("SecLabelStmt" in s) {
    return secLabelStmt(s.SecLabelStmt);
  } else if ("SelectStmt" in s) {
    return selectStmt(s.SelectStmt);
  } else if ("TransactionStmt" in s) {
    return transactionStmt(s.TransactionStmt);
  } else if ("TruncateStmt" in s) {
    return truncateStmt(s.TruncateStmt);
  } else if ("UnlistenStmt" in s) {
    return unlistenStmt(s.UnlistenStmt);
  } else if ("UpdateStmt" in s) {
    return updateStmt(s.UpdateStmt);
  } else if ("VacuumStmt" in s) {
    return vacuumStmt(s.VacuumStmt);
  } else if ("VariableSetStmt" in s) {
    return variableSetStmt(s.VariableSetStmt);
  } else if ("VariableShowStmt" in s) {
    return variableShowStmt(s.VariableShowStmt);
  } else if ("ViewStmt" in s) {
    return viewStmt(s.ViewStmt);
  } else if ("Comment" in s) {
    return comment(s.Comment);
  }

  throw new Error("Cannot format " + Object.keys(s));
}
