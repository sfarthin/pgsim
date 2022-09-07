/**
 * This file was generated, DO NOT EDIT directly. See ./scaffold or run pgsim-scaffold
 **/
import { or, addStmtType, _ } from "./util";
import { alterDatabaseSetStmt } from "./alterDatabaseSetStmt";
import { alterDatabaseStmt } from "./alterDatabaseStmt";
import { alterDefaultPrivilegesStmt } from "./alterDefaultPrivilegesStmt";
import { alterEnumStmt } from "./alterEnumStmt";
import { alterFunctionStmt } from "./alterFunctionStmt";
import { alterObjectSchemaStmt } from "./alterObjectSchemaStmt";
import { alterOperatorStmt } from "./alterOperatorStmt";
import { alterOpFamilyStmt } from "./alterOpFamilyStmt";
import { alterOwnerStmt } from "./alterOwnerStmt";
import { alterRoleSetStmt } from "./alterRoleSetStmt";
import { alterRoleStmt } from "./alterRoleStmt";
import { alterSeqStmt } from "./alterSeqStmt";
import { alterTableStmt } from "./alterTableStmt";
import { alterTsConfigurationStmt } from "./alterTsConfigurationStmt";
import { alterTsDictionaryStmt } from "./alterTsDictionaryStmt";
import { closePortalStmt } from "./closePortalStmt";
import { clusterStmt } from "./clusterStmt";
import { commentStmt } from "./commentStmt";
import { compositeTypeStmt } from "./compositeTypeStmt";
import { copyStmt } from "./copyStmt";
import { createCastStmt } from "./createCastStmt";
import { createConversionStmt } from "./createConversionStmt";
import { createDomainStmt } from "./createDomainStmt";
import { createEnumStmt } from "./createEnumStmt";
import { createEventTrigStmt } from "./createEventTrigStmt";
import { createFdwStmt } from "./createFdwStmt";
import { createForeignServerStmt } from "./createForeignServerStmt";
import { createFunctionStmt } from "./createFunctionStmt";
import { createOpClassStmt } from "./createOpClassStmt";
import { createOpFamilyStmt } from "./createOpFamilyStmt";
import { createPLangStmt } from "./createPLangStmt";
import { createPolicyStmt } from "./createPolicyStmt";
import { createRangeStmt } from "./createRangeStmt";
import { createRoleStmt } from "./createRoleStmt";
import { createSchemaStmt } from "./createSchemaStmt";
import { createSeqStmt } from "./createSeqStmt";
import { createStatsStmt } from "./createStatsStmt";
import { createStmt } from "./createStmt";
import { createTableAsStmt } from "./createTableAsStmt";
import { createTrigStmt } from "./createTrigStmt";
import { deallocateStmt } from "./deallocateStmt";
import { declareCursorStmt } from "./declareCursorStmt";
import { defineStmt } from "./defineStmt";
import { deleteStmt } from "./deleteStmt";
import { discardStmt } from "./discardStmt";
import { doStmt } from "./doStmt";
import { dropRoleStmt } from "./dropRoleStmt";
import { dropStmt } from "./dropStmt";
import { executeStmt } from "./executeStmt";
import { explainStmt } from "./explainStmt";
import { fetchStmt } from "./fetchStmt";
import { grantStmt } from "./grantStmt";
import { indexStmt } from "./indexStmt";
import { insertStmt } from "./insertStmt";
import { listenStmt } from "./listenStmt";
import { lockStmt } from "./lockStmt";
import { notifyStmt } from "./notifyStmt";
import { prepareStmt } from "./prepareStmt";
import { reindexStmt } from "./reindexStmt";
import { renameStmt } from "./renameStmt";
import { ruleStmt } from "./ruleStmt";
import { secLabelStmt } from "./secLabelStmt";
import { selectStmt } from "./selectStmt";
import { transactionStmt } from "./transactionStmt";
import { truncateStmt } from "./truncateStmt";
import { unlistenStmt } from "./unlistenStmt";
import { updateStmt } from "./updateStmt";
import { vacuumStmt } from "./vacuumStmt";
import { variableSetStmt } from "./variableSetStmt";
import { variableShowStmt } from "./variableShowStmt";
import { viewStmt } from "./viewStmt";

export const stmt = or([
  or([
    addStmtType("AlterDatabaseSetStmt", alterDatabaseSetStmt),
    addStmtType("AlterDatabaseStmt", alterDatabaseStmt),
    addStmtType("AlterDefaultPrivilegesStmt", alterDefaultPrivilegesStmt),
    addStmtType("AlterEnumStmt", alterEnumStmt),
    addStmtType("AlterFunctionStmt", alterFunctionStmt),
    addStmtType("AlterObjectSchemaStmt", alterObjectSchemaStmt),
    addStmtType("AlterOperatorStmt", alterOperatorStmt),
    addStmtType("AlterOpFamilyStmt", alterOpFamilyStmt),
    addStmtType("AlterOwnerStmt", alterOwnerStmt),
    addStmtType("AlterRoleSetStmt", alterRoleSetStmt),
  ]),
  or([
    addStmtType("AlterRoleStmt", alterRoleStmt),
    addStmtType("AlterSeqStmt", alterSeqStmt),
    addStmtType("AlterTableStmt", alterTableStmt),
    addStmtType("AlterTSConfigurationStmt", alterTsConfigurationStmt),
    addStmtType("AlterTSDictionaryStmt", alterTsDictionaryStmt),
    addStmtType("ClosePortalStmt", closePortalStmt),
    addStmtType("ClusterStmt", clusterStmt),
    addStmtType("CommentStmt", commentStmt),
    addStmtType("CompositeTypeStmt", compositeTypeStmt),
    addStmtType("CopyStmt", copyStmt),
  ]),
  or([
    addStmtType("CreateCastStmt", createCastStmt),
    addStmtType("CreateConversionStmt", createConversionStmt),
    addStmtType("CreateDomainStmt", createDomainStmt),
    addStmtType("CreateEnumStmt", createEnumStmt),
    addStmtType("CreateEventTrigStmt", createEventTrigStmt),
    addStmtType("CreateFdwStmt", createFdwStmt),
    addStmtType("CreateForeignServerStmt", createForeignServerStmt),
    addStmtType("CreateFunctionStmt", createFunctionStmt),
    addStmtType("CreateOpClassStmt", createOpClassStmt),
    addStmtType("CreateOpFamilyStmt", createOpFamilyStmt),
  ]),
  or([
    addStmtType("CreatePLangStmt", createPLangStmt),
    addStmtType("CreatePolicyStmt", createPolicyStmt),
    addStmtType("CreateRangeStmt", createRangeStmt),
    addStmtType("CreateRoleStmt", createRoleStmt),
    addStmtType("CreateSchemaStmt", createSchemaStmt),
    addStmtType("CreateSeqStmt", createSeqStmt),
    addStmtType("CreateStatsStmt", createStatsStmt),
    addStmtType("CreateStmt", createStmt),
    addStmtType("CreateTableAsStmt", createTableAsStmt),
    addStmtType("CreateTrigStmt", createTrigStmt),
  ]),
  or([
    addStmtType("DeallocateStmt", deallocateStmt),
    addStmtType("DeclareCursorStmt", declareCursorStmt),
    addStmtType("DefineStmt", defineStmt),
    addStmtType("DeleteStmt", deleteStmt),
    addStmtType("DiscardStmt", discardStmt),
    addStmtType("DoStmt", doStmt),
    addStmtType("DropRoleStmt", dropRoleStmt),
    addStmtType("DropStmt", dropStmt),
    addStmtType("ExecuteStmt", executeStmt),
    addStmtType("ExplainStmt", explainStmt),
  ]),
  or([
    addStmtType("FetchStmt", fetchStmt),
    addStmtType("GrantStmt", grantStmt),
    addStmtType("IndexStmt", indexStmt),
    addStmtType("InsertStmt", insertStmt),
    addStmtType("ListenStmt", listenStmt),
    addStmtType("LockStmt", lockStmt),
    addStmtType("NotifyStmt", notifyStmt),
    addStmtType("PrepareStmt", prepareStmt),
    addStmtType("ReindexStmt", reindexStmt),
    addStmtType("RenameStmt", renameStmt),
  ]),
  or([
    addStmtType("RuleStmt", ruleStmt),
    addStmtType("SecLabelStmt", secLabelStmt),
    addStmtType("SelectStmt", selectStmt),
    addStmtType("TransactionStmt", transactionStmt),
    addStmtType("TruncateStmt", truncateStmt),
    addStmtType("UnlistenStmt", unlistenStmt),
    addStmtType("UpdateStmt", updateStmt),
    addStmtType("VacuumStmt", vacuumStmt),
    addStmtType("VariableSetStmt", variableSetStmt),
    addStmtType("VariableShowStmt", variableShowStmt),
  ]),
  or([addStmtType("ViewStmt", viewStmt)]),
]);
