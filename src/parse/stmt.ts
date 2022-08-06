/**
 * This file was generated, DO NOT EDIT directly. See ./scaffold or run pgsim-scaffold
 **/
import { or } from "./util";
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
import { comment } from "./comment";

export const stmt = or([
  or([
    alterDatabaseSetStmt,
    alterDatabaseStmt,
    alterDefaultPrivilegesStmt,
    alterEnumStmt,
    alterFunctionStmt,
    alterObjectSchemaStmt,
    alterOperatorStmt,
    alterOpFamilyStmt,
    alterOwnerStmt,
    alterRoleSetStmt,
  ]),
  or([
    alterRoleStmt,
    alterSeqStmt,
    alterTableStmt,
    alterTsConfigurationStmt,
    alterTsDictionaryStmt,
    closePortalStmt,
    clusterStmt,
    commentStmt,
    compositeTypeStmt,
    copyStmt,
  ]),
  or([
    createCastStmt,
    createConversionStmt,
    createDomainStmt,
    createEnumStmt,
    createEventTrigStmt,
    createFdwStmt,
    createForeignServerStmt,
    createFunctionStmt,
    createOpClassStmt,
    createOpFamilyStmt,
  ]),
  or([
    createPLangStmt,
    createPolicyStmt,
    createRangeStmt,
    createRoleStmt,
    createSchemaStmt,
    createSeqStmt,
    createStatsStmt,
    createStmt,
    createTableAsStmt,
    createTrigStmt,
  ]),
  or([
    deallocateStmt,
    declareCursorStmt,
    defineStmt,
    deleteStmt,
    discardStmt,
    doStmt,
    dropRoleStmt,
    dropStmt,
    executeStmt,
    explainStmt,
  ]),
  or([
    fetchStmt,
    grantStmt,
    indexStmt,
    insertStmt,
    listenStmt,
    lockStmt,
    notifyStmt,
    prepareStmt,
    reindexStmt,
    renameStmt,
  ]),
  or([
    ruleStmt,
    secLabelStmt,
    selectStmt,
    transactionStmt,
    truncateStmt,
    unlistenStmt,
    updateStmt,
    vacuumStmt,
    variableSetStmt,
    variableShowStmt,
  ]),
  or([viewStmt, comment]),
]);
