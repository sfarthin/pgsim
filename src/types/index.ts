/**
 * This file was generated, DO NOT EDIT directly. See ./scaffold and run pgsim-generate
 **/
import * as d from "decoders";
import dispatch from "./dispatch";
import { Block } from "~/format/util";
import { KeysOfUnion } from "./util";

import { CreateStmt, createStmtDecoder } from "./createStmt";
import { AlterTableStmt, alterTableStmtDecoder } from "./alterTableStmt";
import { CreateSeqStmt, createSeqStmtDecoder } from "./createSeqStmt";
import { VariableSetStmt, variableSetStmtDecoder } from "./variableSetStmt";
import { CreateEnumStmt, createEnumStmtDecoder } from "./createEnumStmt";
import { AlterSeqStmt, alterSeqStmtDecoder } from "./alterSeqStmt";
import { DropStmt, dropStmtDecoder } from "./dropStmt";
import { AlterEnumStmt, alterEnumStmtDecoder } from "./alterEnumStmt";
import { AlterOwnerStmt, alterOwnerStmtDecoder } from "./alterOwnerStmt";
import { IndexStmt, indexStmtDecoder } from "./indexStmt";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { ViewStmt, viewStmtDecoder } from "./viewStmt";
import { RenameStmt, renameStmtDecoder } from "./renameStmt";
import { UpdateStmt, updateStmtDecoder } from "./updateStmt";
import { TransactionStmt, transactionStmtDecoder } from "./transactionStmt";
import {
  AlterDatabaseSetStmt,
  alterDatabaseSetStmtDecoder,
} from "./alterDatabaseSetStmt";
import {
  AlterDatabaseStmt,
  alterDatabaseStmtDecoder,
} from "./alterDatabaseStmt";
import { RenameStmt, renameStmtDecoder } from "./renameStmt";
import {
  CompositeTypeStmt,
  compositeTypeStmtDecoder,
} from "./compositeTypeStmt";
import { InsertStmt, insertStmtDecoder } from "./insertStmt";
import { DropStmt, dropStmtDecoder } from "./dropStmt";
import { DefineStmt, defineStmtDecoder } from "./defineStmt";
import {
  CreateFunctionStmt,
  createFunctionStmtDecoder,
} from "./createFunctionStmt";
import { CreateCastStmt, createCastStmtDecoder } from "./createCastStmt";
import { DeleteStmt, deleteStmtDecoder } from "./deleteStmt";
import { CreateRangeStmt, createRangeStmtDecoder } from "./createRangeStmt";
import { TruncateStmt, truncateStmtDecoder } from "./truncateStmt";
import { ExplainStmt, explainStmtDecoder } from "./explainStmt";
import { CreateRoleStmt, createRoleStmtDecoder } from "./createRoleStmt";
import { DropRoleStmt, dropRoleStmtDecoder } from "./dropRoleStmt";
import {
  CreateTableAsStmt,
  createTableAsStmtDecoder,
} from "./createTableAsStmt";
import { VariableShowStmt, variableShowStmtDecoder } from "./variableShowStmt";
import { VacuumStmt, vacuumStmtDecoder } from "./vacuumStmt";
import { AlterRoleStmt, alterRoleStmtDecoder } from "./alterRoleStmt";
import { CreateSchemaStmt, createSchemaStmtDecoder } from "./createSchemaStmt";
import {
  AlterDefaultPrivilegesStmt,
  alterDefaultPrivilegesStmtDecoder,
} from "./alterDefaultPrivilegesStmt";
import { GrantStmt, grantStmtDecoder } from "./grantStmt";
import {
  DeclareCursorStmt,
  declareCursorStmtDecoder,
} from "./declareCursorStmt";
import { CopyStmt, copyStmtDecoder } from "./copyStmt";
import { CreateDomainStmt, createDomainStmtDecoder } from "./createDomainStmt";
import { FetchStmt, fetchStmtDecoder } from "./fetchStmt";
import { ClosePortalStmt, closePortalStmtDecoder } from "./closePortalStmt";
import { PrepareStmt, prepareStmtDecoder } from "./prepareStmt";
import { ExecuteStmt, executeStmtDecoder } from "./executeStmt";
import { RuleStmt, ruleStmtDecoder } from "./ruleStmt";
import { ReindexStmt, reindexStmtDecoder } from "./reindexStmt";
import { SecLabelStmt, secLabelStmtDecoder } from "./secLabelStmt";
import { AlterRoleSetStmt, alterRoleSetStmtDecoder } from "./alterRoleSetStmt";
import { LockStmt, lockStmtDecoder } from "./lockStmt";
import { NotifyStmt, notifyStmtDecoder } from "./notifyStmt";
import { ListenStmt, listenStmtDecoder } from "./listenStmt";
import { UnlistenStmt, unlistenStmtDecoder } from "./unlistenStmt";
import { DiscardStmt, discardStmtDecoder } from "./discardStmt";
import {
  AlterFunctionStmt,
  alterFunctionStmtDecoder,
} from "./alterFunctionStmt";
import {
  AlterTSConfigurationStmt,
  alterTsConfigurationStmtDecoder,
} from "./alterTsConfigurationStmt";
import {
  AlterTSDictionaryStmt,
  alterTsDictionaryStmtDecoder,
} from "./alterTsDictionaryStmt";
import { CreateTrigStmt, createTrigStmtDecoder } from "./createTrigStmt";
import {
  AlterOpFamilyStmt,
  alterOpFamilyStmtDecoder,
} from "./alterOpFamilyStmt";
import { CreatePolicyStmt, createPolicyStmtDecoder } from "./createPolicyStmt";
import { DeallocateStmt, deallocateStmtDecoder } from "./deallocateStmt";
import {
  CreateConversionStmt,
  createConversionStmtDecoder,
} from "./createConversionStmt";
import { CommentStmt, commentStmtDecoder } from "./commentStmt";
import {
  AlterObjectSchemaStmt,
  alterObjectSchemaStmtDecoder,
} from "./alterObjectSchemaStmt";
import { CreateFdwStmt, createFdwStmtDecoder } from "./createFdwStmt";
import {
  CreateForeignServerStmt,
  createForeignServerStmtDecoder,
} from "./createForeignServerStmt";
import { CreatePLangStmt, createPLangStmtDecoder } from "./createPLangStmt";
import {
  CreateOpFamilyStmt,
  createOpFamilyStmtDecoder,
} from "./createOpFamilyStmt";
import {
  CreateOpClassStmt,
  createOpClassStmtDecoder,
} from "./createOpClassStmt";
import { DoStmt, doStmtDecoder } from "./doStmt";
import { CreateStatsStmt, createStatsStmtDecoder } from "./createStatsStmt";
import {
  AlterOperatorStmt,
  alterOperatorStmtDecoder,
} from "./alterOperatorStmt";
import { ClusterStmt, clusterStmtDecoder } from "./clusterStmt";
import {
  CreateEventTrigStmt,
  createEventTrigStmtDecoder,
} from "./createEventTrigStmt";
export * from "./InsertStmt";
export * from "./aExpr";
export * from "./aIndirection";
export * from "./alias";
export * from "./alterDatabaseSetStmt";
export * from "./alterDatabaseStmt";
export * from "./alterEnumStmt";
export * from "./alterOwnerStmt";
export * from "./alterSeqStmt";
export * from "./alterTableStmt";
export * from "./boolExpr";
export * from "./booleanTest";
export * from "./caseExpr";
export * from "./columnRef";
export * from "./constant";
export * from "./constraint";
export * from "./createEnumStmt";
export * from "./createSeqStmt";
export * from "./createStmt";
export * from "./defElem";
export * from "./dispatch";
export * from "./dropBehavior";
export * from "./dropStmt";
export * from "./fromClause";
export * from "./funcCall";
export * from "./indexStmt";
export * from "./joinExpr";
export * from "./list";
export * from "./location";
export * from "./nullTest";
export * from "./rangeSubselect";
export * from "./rangeVar";
export * from "./rawExpr";
export * from "./renameStmt";
export * from "./resTarget";
export * from "./rowExpr";
export * from "./selectStmt";
export * from "./sortBy";
export * from "./subLink";
export * from "./transactionStmt";
export * from "./typeCast";
export * from "./typeName";
export * from "./updateStmt";
export * from "./util";
export * from "./variableSetStmt";
export * from "./viewStmt";

export type Stmt = {
  stmt_len?: number, // <-- This simulates the same fields we have on the native parser
  stmt_location?: number, // <-- This simulates the same fields we have on the native parser
  tokens?: Block, // <-- This is only supported by our parser
  stmt:
    | { CreateStmt: CreateStmt }
    | { AlterTableStmt: AlterTableStmt }
    | { CreateSeqStmt: CreateSeqStmt }
    | { VariableSetStmt: VariableSetStmt }
    | { CreateEnumStmt: CreateEnumStmt }
    | { AlterSeqStmt: AlterSeqStmt }
    | { DropStmt: DropStmt }
    | { AlterEnumStmt: AlterEnumStmt }
    | { AlterOwnerStmt: AlterOwnerStmt }
    | { IndexStmt: IndexStmt }
    | { SelectStmt: SelectStmt }
    | { ViewStmt: ViewStmt }
    | { RenameStmt: RenameStmt }
    | { UpdateStmt: UpdateStmt }
    | { TransactionStmt: TransactionStmt }
    | { AlterDatabaseSetStmt: AlterDatabaseSetStmt }
    | { AlterDatabaseStmt: AlterDatabaseStmt }
    | { RenameStmt: RenameStmt }
    | { CompositeTypeStmt: CompositeTypeStmt }
    | { InsertStmt: InsertStmt }
    | { DropStmt: DropStmt }
    | { DefineStmt: DefineStmt }
    | { CreateFunctionStmt: CreateFunctionStmt }
    | { CreateCastStmt: CreateCastStmt }
    | { DeleteStmt: DeleteStmt }
    | { CreateRangeStmt: CreateRangeStmt }
    | { TruncateStmt: TruncateStmt }
    | { ExplainStmt: ExplainStmt }
    | { CreateRoleStmt: CreateRoleStmt }
    | { DropRoleStmt: DropRoleStmt }
    | { CreateTableAsStmt: CreateTableAsStmt }
    | { VariableShowStmt: VariableShowStmt }
    | { VacuumStmt: VacuumStmt }
    | { AlterRoleStmt: AlterRoleStmt }
    | { CreateSchemaStmt: CreateSchemaStmt }
    | { AlterDefaultPrivilegesStmt: AlterDefaultPrivilegesStmt }
    | { GrantStmt: GrantStmt }
    | { DeclareCursorStmt: DeclareCursorStmt }
    | { CopyStmt: CopyStmt }
    | { CreateDomainStmt: CreateDomainStmt }
    | { FetchStmt: FetchStmt }
    | { ClosePortalStmt: ClosePortalStmt }
    | { PrepareStmt: PrepareStmt }
    | { ExecuteStmt: ExecuteStmt }
    | { RuleStmt: RuleStmt }
    | { ReindexStmt: ReindexStmt }
    | { SecLabelStmt: SecLabelStmt }
    | { AlterRoleSetStmt: AlterRoleSetStmt }
    | { LockStmt: LockStmt }
    | { NotifyStmt: NotifyStmt }
    | { ListenStmt: ListenStmt }
    | { UnlistenStmt: UnlistenStmt }
    | { DiscardStmt: DiscardStmt }
    | { AlterFunctionStmt: AlterFunctionStmt }
    | { AlterTSConfigurationStmt: AlterTSConfigurationStmt }
    | { AlterTSDictionaryStmt: AlterTSDictionaryStmt }
    | { CreateTrigStmt: CreateTrigStmt }
    | { AlterOpFamilyStmt: AlterOpFamilyStmt }
    | { CreatePolicyStmt: CreatePolicyStmt }
    | { DeallocateStmt: DeallocateStmt }
    | { CreateConversionStmt: CreateConversionStmt }
    | { CommentStmt: CommentStmt }
    | { AlterObjectSchemaStmt: AlterObjectSchemaStmt }
    | { CreateFdwStmt: CreateFdwStmt }
    | { CreateForeignServerStmt: CreateForeignServerStmt }
    | { CreatePLangStmt: CreatePLangStmt }
    | { CreateOpFamilyStmt: CreateOpFamilyStmt }
    | { CreateOpClassStmt: CreateOpClassStmt }
    | { DoStmt: DoStmt }
    | { CreateStatsStmt: CreateStatsStmt }
    | { AlterOperatorStmt: AlterOperatorStmt }
    | { ClusterStmt: ClusterStmt }
    | { CreateEventTrigStmt: CreateEventTrigStmt },
};

export const stmtDecoder: d.Decoder<Stmt> = d.exact({
  stmt_len: d.optional(d.number),
  stmt_location: d.optional(d.number),
  stmt: dispatch({
    CreateStmt: createStmtDecoder,
    AlterTableStmt: alterTableStmtDecoder,
    CreateSeqStmt: createSeqStmtDecoder,
    VariableSetStmt: variableSetStmtDecoder,
    CreateEnumStmt: createEnumStmtDecoder,
    AlterSeqStmt: alterSeqStmtDecoder,
    DropStmt: dropStmtDecoder,
    AlterEnumStmt: alterEnumStmtDecoder,
    AlterOwnerStmt: alterOwnerStmtDecoder,
    IndexStmt: indexStmtDecoder,
    SelectStmt: selectStmtDecoder,
    ViewStmt: viewStmtDecoder,
    RenameStmt: renameStmtDecoder,
    UpdateStmt: updateStmtDecoder,
    TransactionStmt: transactionStmtDecoder,
    AlterDatabaseSetStmt: alterDatabaseSetStmtDecoder,
    AlterDatabaseStmt: alterDatabaseStmtDecoder,
    RenameStmt: renameStmtDecoder,
    CompositeTypeStmt: compositeTypeStmtDecoder,
    InsertStmt: insertStmtDecoder,
    DropStmt: dropStmtDecoder,
    DefineStmt: defineStmtDecoder,
    CreateFunctionStmt: createFunctionStmtDecoder,
    CreateCastStmt: createCastStmtDecoder,
    DeleteStmt: deleteStmtDecoder,
    CreateRangeStmt: createRangeStmtDecoder,
    TruncateStmt: truncateStmtDecoder,
    ExplainStmt: explainStmtDecoder,
    CreateRoleStmt: createRoleStmtDecoder,
    DropRoleStmt: dropRoleStmtDecoder,
    CreateTableAsStmt: createTableAsStmtDecoder,
    VariableShowStmt: variableShowStmtDecoder,
    VacuumStmt: vacuumStmtDecoder,
    AlterRoleStmt: alterRoleStmtDecoder,
    CreateSchemaStmt: createSchemaStmtDecoder,
    AlterDefaultPrivilegesStmt: alterDefaultPrivilegesStmtDecoder,
    GrantStmt: grantStmtDecoder,
    DeclareCursorStmt: declareCursorStmtDecoder,
    CopyStmt: copyStmtDecoder,
    CreateDomainStmt: createDomainStmtDecoder,
    FetchStmt: fetchStmtDecoder,
    ClosePortalStmt: closePortalStmtDecoder,
    PrepareStmt: prepareStmtDecoder,
    ExecuteStmt: executeStmtDecoder,
    RuleStmt: ruleStmtDecoder,
    ReindexStmt: reindexStmtDecoder,
    SecLabelStmt: secLabelStmtDecoder,
    AlterRoleSetStmt: alterRoleSetStmtDecoder,
    LockStmt: lockStmtDecoder,
    NotifyStmt: notifyStmtDecoder,
    ListenStmt: listenStmtDecoder,
    UnlistenStmt: unlistenStmtDecoder,
    DiscardStmt: discardStmtDecoder,
    AlterFunctionStmt: alterFunctionStmtDecoder,
    AlterTSConfigurationStmt: alterTsConfigurationStmtDecoder,
    AlterTSDictionaryStmt: alterTsDictionaryStmtDecoder,
    CreateTrigStmt: createTrigStmtDecoder,
    AlterOpFamilyStmt: alterOpFamilyStmtDecoder,
    CreatePolicyStmt: createPolicyStmtDecoder,
    DeallocateStmt: deallocateStmtDecoder,
    CreateConversionStmt: createConversionStmtDecoder,
    CommentStmt: commentStmtDecoder,
    AlterObjectSchemaStmt: alterObjectSchemaStmtDecoder,
    CreateFdwStmt: createFdwStmtDecoder,
    CreateForeignServerStmt: createForeignServerStmtDecoder,
    CreatePLangStmt: createPLangStmtDecoder,
    CreateOpFamilyStmt: createOpFamilyStmtDecoder,
    CreateOpClassStmt: createOpClassStmtDecoder,
    DoStmt: doStmtDecoder,
    CreateStatsStmt: createStatsStmtDecoder,
    AlterOperatorStmt: alterOperatorStmtDecoder,
    ClusterStmt: clusterStmtDecoder,
    CreateEventTrigStmt: createEventTrigStmtDecoder,
  }),
});

export type StatementType = KeysOfUnion<Stmt["stmt"]>;
