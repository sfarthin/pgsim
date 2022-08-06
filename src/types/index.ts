/**
 * This file was generated, DO NOT EDIT directly. See ./scaffold or run pgsim-scaffold
 **/
import * as d from "decoders";
import dispatch from "./dispatch";
import { Block } from "~/format/util";
import { KeysOfUnion } from "./util";
import {
  AlterDatabaseSetStmt,
  alterDatabaseSetStmtDecoder,
} from "./alterDatabaseSetStmt";
import {
  AlterDatabaseStmt,
  alterDatabaseStmtDecoder,
} from "./alterDatabaseStmt";
import {
  AlterDefaultPrivilegesStmt,
  alterDefaultPrivilegesStmtDecoder,
} from "./alterDefaultPrivilegesStmt";
import { AlterEnumStmt, alterEnumStmtDecoder } from "./alterEnumStmt";
import {
  AlterFunctionStmt,
  alterFunctionStmtDecoder,
} from "./alterFunctionStmt";
import {
  AlterObjectSchemaStmt,
  alterObjectSchemaStmtDecoder,
} from "./alterObjectSchemaStmt";
import {
  AlterOperatorStmt,
  alterOperatorStmtDecoder,
} from "./alterOperatorStmt";
import {
  AlterOpFamilyStmt,
  alterOpFamilyStmtDecoder,
} from "./alterOpFamilyStmt";
import { AlterOwnerStmt, alterOwnerStmtDecoder } from "./alterOwnerStmt";
import { AlterRoleSetStmt, alterRoleSetStmtDecoder } from "./alterRoleSetStmt";
import { AlterRoleStmt, alterRoleStmtDecoder } from "./alterRoleStmt";
import { AlterSeqStmt, alterSeqStmtDecoder } from "./alterSeqStmt";
import { AlterTableStmt, alterTableStmtDecoder } from "./alterTableStmt";
import {
  AlterTSConfigurationStmt,
  alterTsConfigurationStmtDecoder,
} from "./alterTsConfigurationStmt";
import {
  AlterTSDictionaryStmt,
  alterTsDictionaryStmtDecoder,
} from "./alterTsDictionaryStmt";
import { ClosePortalStmt, closePortalStmtDecoder } from "./closePortalStmt";
import { ClusterStmt, clusterStmtDecoder } from "./clusterStmt";
import { CommentStmt, commentStmtDecoder } from "./commentStmt";
import {
  CompositeTypeStmt,
  compositeTypeStmtDecoder,
} from "./compositeTypeStmt";
import { CopyStmt, copyStmtDecoder } from "./copyStmt";
import { CreateCastStmt, createCastStmtDecoder } from "./createCastStmt";
import {
  CreateConversionStmt,
  createConversionStmtDecoder,
} from "./createConversionStmt";
import { CreateDomainStmt, createDomainStmtDecoder } from "./createDomainStmt";
import { CreateEnumStmt, createEnumStmtDecoder } from "./createEnumStmt";
import {
  CreateEventTrigStmt,
  createEventTrigStmtDecoder,
} from "./createEventTrigStmt";
import { CreateFdwStmt, createFdwStmtDecoder } from "./createFdwStmt";
import {
  CreateForeignServerStmt,
  createForeignServerStmtDecoder,
} from "./createForeignServerStmt";
import {
  CreateFunctionStmt,
  createFunctionStmtDecoder,
} from "./createFunctionStmt";
import {
  CreateOpClassStmt,
  createOpClassStmtDecoder,
} from "./createOpClassStmt";
import {
  CreateOpFamilyStmt,
  createOpFamilyStmtDecoder,
} from "./createOpFamilyStmt";
import { CreatePLangStmt, createPLangStmtDecoder } from "./createPLangStmt";
import { CreatePolicyStmt, createPolicyStmtDecoder } from "./createPolicyStmt";
import { CreateRangeStmt, createRangeStmtDecoder } from "./createRangeStmt";
import { CreateRoleStmt, createRoleStmtDecoder } from "./createRoleStmt";
import { CreateSchemaStmt, createSchemaStmtDecoder } from "./createSchemaStmt";
import { CreateSeqStmt, createSeqStmtDecoder } from "./createSeqStmt";
import { CreateStatsStmt, createStatsStmtDecoder } from "./createStatsStmt";
import { CreateStmt, createStmtDecoder } from "./createStmt";
import {
  CreateTableAsStmt,
  createTableAsStmtDecoder,
} from "./createTableAsStmt";
import { CreateTrigStmt, createTrigStmtDecoder } from "./createTrigStmt";
import { DeallocateStmt, deallocateStmtDecoder } from "./deallocateStmt";
import {
  DeclareCursorStmt,
  declareCursorStmtDecoder,
} from "./declareCursorStmt";
import { DefineStmt, defineStmtDecoder } from "./defineStmt";
import { DeleteStmt, deleteStmtDecoder } from "./deleteStmt";
import { DiscardStmt, discardStmtDecoder } from "./discardStmt";
import { DoStmt, doStmtDecoder } from "./doStmt";
import { DropRoleStmt, dropRoleStmtDecoder } from "./dropRoleStmt";
import { DropStmt, dropStmtDecoder } from "./dropStmt";
import { ExecuteStmt, executeStmtDecoder } from "./executeStmt";
import { ExplainStmt, explainStmtDecoder } from "./explainStmt";
import { FetchStmt, fetchStmtDecoder } from "./fetchStmt";
import { GrantStmt, grantStmtDecoder } from "./grantStmt";
import { IndexStmt, indexStmtDecoder } from "./indexStmt";
import { InsertStmt, insertStmtDecoder } from "./insertStmt";
import { ListenStmt, listenStmtDecoder } from "./listenStmt";
import { LockStmt, lockStmtDecoder } from "./lockStmt";
import { NotifyStmt, notifyStmtDecoder } from "./notifyStmt";
import { PrepareStmt, prepareStmtDecoder } from "./prepareStmt";
import { ReindexStmt, reindexStmtDecoder } from "./reindexStmt";
import { RenameStmt, renameStmtDecoder } from "./renameStmt";
import { RuleStmt, ruleStmtDecoder } from "./ruleStmt";
import { SecLabelStmt, secLabelStmtDecoder } from "./secLabelStmt";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { TransactionStmt, transactionStmtDecoder } from "./transactionStmt";
import { TruncateStmt, truncateStmtDecoder } from "./truncateStmt";
import { UnlistenStmt, unlistenStmtDecoder } from "./unlistenStmt";
import { UpdateStmt, updateStmtDecoder } from "./updateStmt";
import { VacuumStmt, vacuumStmtDecoder } from "./vacuumStmt";
import { VariableSetStmt, variableSetStmtDecoder } from "./variableSetStmt";
import { VariableShowStmt, variableShowStmtDecoder } from "./variableShowStmt";
import { ViewStmt, viewStmtDecoder } from "./viewStmt";
import { Comment, commentDecoder } from "./comment";
export * from "./aExpr";
export * from "./aIndirection";
export * from "./alias";
export * from "./alterDatabaseSetStmt";
export * from "./alterDatabaseStmt";
export * from "./alterDefaultPrivilegesStmt";
export * from "./alterEnumStmt";
export * from "./alterFunctionStmt";
export * from "./alterObjectSchemaStmt";
export * from "./alterOpFamilyStmt";
export * from "./alterOperatorStmt";
export * from "./alterOwnerStmt";
export * from "./alterRoleSetStmt";
export * from "./alterRoleStmt";
export * from "./alterSeqStmt";
export * from "./alterTableStmt";
export * from "./alterTsConfigurationStmt";
export * from "./alterTsDictionaryStmt";
export * from "./boolExpr";
export * from "./booleanTest";
export * from "./caseExpr";
export * from "./closePortalStmt";
export * from "./clusterStmt";
export * from "./columnRef";
export * from "./comment";
export * from "./commentStmt";
export * from "./compositeTypeStmt";
export * from "./constant";
export * from "./constraint";
export * from "./copyStmt";
export * from "./createCastStmt";
export * from "./createConversionStmt";
export * from "./createDomainStmt";
export * from "./createEnumStmt";
export * from "./createEventTrigStmt";
export * from "./createFdwStmt";
export * from "./createForeignServerStmt";
export * from "./createFunctionStmt";
export * from "./createOpClassStmt";
export * from "./createOpFamilyStmt";
export * from "./createPLangStmt";
export * from "./createPolicyStmt";
export * from "./createRangeStmt";
export * from "./createRoleStmt";
export * from "./createSchemaStmt";
export * from "./createSeqStmt";
export * from "./createStatsStmt";
export * from "./createStmt";
export * from "./createTableAsStmt";
export * from "./createTrigStmt";
export * from "./deallocateStmt";
export * from "./declareCursorStmt";
export * from "./defElem";
export * from "./defineStmt";
export * from "./deleteStmt";
export * from "./discardStmt";
export * from "./dispatch";
export * from "./doStmt";
export * from "./dropBehavior";
export * from "./dropRoleStmt";
export * from "./dropStmt";
export * from "./executeStmt";
export * from "./explainStmt";
export * from "./fetchStmt";
export * from "./fromClause";
export * from "./funcCall";
export * from "./grantStmt";
export * from "./indexStmt";
export * from "./insertStmt";
export * from "./joinExpr";
export * from "./list";
export * from "./listenStmt";
export * from "./location";
export * from "./lockStmt";
export * from "./notifyStmt";
export * from "./nullTest";
export * from "./prepareStmt";
export * from "./rangeSubselect";
export * from "./rangeVar";
export * from "./rawExpr";
export * from "./reindexStmt";
export * from "./renameStmt";
export * from "./resTarget";
export * from "./rowExpr";
export * from "./ruleStmt";
export * from "./secLabelStmt";
export * from "./selectStmt";
export * from "./sortBy";
export * from "./subLink";
export * from "./transactionStmt";
export * from "./truncateStmt";
export * from "./typeCast";
export * from "./typeName";
export * from "./unlistenStmt";
export * from "./updateStmt";
export * from "./util";
export * from "./vacuumStmt";
export * from "./variableSetStmt";
export * from "./variableShowStmt";
export * from "./viewStmt";

export type Stmt = {
  stmt_len?: number, // <-- This simulates the same fields we have on the native parser
  stmt_location?: number, // <-- This simulates the same fields we have on the native parser
  tokens?: Block, // <-- This is only supported by our parser
  stmt:
    | { AlterDatabaseSetStmt: AlterDatabaseSetStmt }
    | { AlterDatabaseStmt: AlterDatabaseStmt }
    | { AlterDefaultPrivilegesStmt: AlterDefaultPrivilegesStmt }
    | { AlterEnumStmt: AlterEnumStmt }
    | { AlterFunctionStmt: AlterFunctionStmt }
    | { AlterObjectSchemaStmt: AlterObjectSchemaStmt }
    | { AlterOperatorStmt: AlterOperatorStmt }
    | { AlterOpFamilyStmt: AlterOpFamilyStmt }
    | { AlterOwnerStmt: AlterOwnerStmt }
    | { AlterRoleSetStmt: AlterRoleSetStmt }
    | { AlterRoleStmt: AlterRoleStmt }
    | { AlterSeqStmt: AlterSeqStmt }
    | { AlterTableStmt: AlterTableStmt }
    | { AlterTSConfigurationStmt: AlterTSConfigurationStmt }
    | { AlterTSDictionaryStmt: AlterTSDictionaryStmt }
    | { ClosePortalStmt: ClosePortalStmt }
    | { ClusterStmt: ClusterStmt }
    | { CommentStmt: CommentStmt }
    | { CompositeTypeStmt: CompositeTypeStmt }
    | { CopyStmt: CopyStmt }
    | { CreateCastStmt: CreateCastStmt }
    | { CreateConversionStmt: CreateConversionStmt }
    | { CreateDomainStmt: CreateDomainStmt }
    | { CreateEnumStmt: CreateEnumStmt }
    | { CreateEventTrigStmt: CreateEventTrigStmt }
    | { CreateFdwStmt: CreateFdwStmt }
    | { CreateForeignServerStmt: CreateForeignServerStmt }
    | { CreateFunctionStmt: CreateFunctionStmt }
    | { CreateOpClassStmt: CreateOpClassStmt }
    | { CreateOpFamilyStmt: CreateOpFamilyStmt }
    | { CreatePLangStmt: CreatePLangStmt }
    | { CreatePolicyStmt: CreatePolicyStmt }
    | { CreateRangeStmt: CreateRangeStmt }
    | { CreateRoleStmt: CreateRoleStmt }
    | { CreateSchemaStmt: CreateSchemaStmt }
    | { CreateSeqStmt: CreateSeqStmt }
    | { CreateStatsStmt: CreateStatsStmt }
    | { CreateStmt: CreateStmt }
    | { CreateTableAsStmt: CreateTableAsStmt }
    | { CreateTrigStmt: CreateTrigStmt }
    | { DeallocateStmt: DeallocateStmt }
    | { DeclareCursorStmt: DeclareCursorStmt }
    | { DefineStmt: DefineStmt }
    | { DeleteStmt: DeleteStmt }
    | { DiscardStmt: DiscardStmt }
    | { DoStmt: DoStmt }
    | { DropRoleStmt: DropRoleStmt }
    | { DropStmt: DropStmt }
    | { ExecuteStmt: ExecuteStmt }
    | { ExplainStmt: ExplainStmt }
    | { FetchStmt: FetchStmt }
    | { GrantStmt: GrantStmt }
    | { IndexStmt: IndexStmt }
    | { InsertStmt: InsertStmt }
    | { ListenStmt: ListenStmt }
    | { LockStmt: LockStmt }
    | { NotifyStmt: NotifyStmt }
    | { PrepareStmt: PrepareStmt }
    | { ReindexStmt: ReindexStmt }
    | { RenameStmt: RenameStmt }
    | { RuleStmt: RuleStmt }
    | { SecLabelStmt: SecLabelStmt }
    | { SelectStmt: SelectStmt }
    | { TransactionStmt: TransactionStmt }
    | { TruncateStmt: TruncateStmt }
    | { UnlistenStmt: UnlistenStmt }
    | { UpdateStmt: UpdateStmt }
    | { VacuumStmt: VacuumStmt }
    | { VariableSetStmt: VariableSetStmt }
    | { VariableShowStmt: VariableShowStmt }
    | { ViewStmt: ViewStmt }
    | { Comment: Comment },
};

export const stmtDecoder: d.Decoder<Stmt> = d.exact({
  stmt_len: d.optional(d.number),
  stmt_location: d.optional(d.number),
  stmt: dispatch({
    AlterDatabaseSetStmt: alterDatabaseSetStmtDecoder,
    AlterDatabaseStmt: alterDatabaseStmtDecoder,
    AlterDefaultPrivilegesStmt: alterDefaultPrivilegesStmtDecoder,
    AlterEnumStmt: alterEnumStmtDecoder,
    AlterFunctionStmt: alterFunctionStmtDecoder,
    AlterObjectSchemaStmt: alterObjectSchemaStmtDecoder,
    AlterOperatorStmt: alterOperatorStmtDecoder,
    AlterOpFamilyStmt: alterOpFamilyStmtDecoder,
    AlterOwnerStmt: alterOwnerStmtDecoder,
    AlterRoleSetStmt: alterRoleSetStmtDecoder,
    AlterRoleStmt: alterRoleStmtDecoder,
    AlterSeqStmt: alterSeqStmtDecoder,
    AlterTableStmt: alterTableStmtDecoder,
    AlterTSConfigurationStmt: alterTsConfigurationStmtDecoder,
    AlterTSDictionaryStmt: alterTsDictionaryStmtDecoder,
    ClosePortalStmt: closePortalStmtDecoder,
    ClusterStmt: clusterStmtDecoder,
    CommentStmt: commentStmtDecoder,
    CompositeTypeStmt: compositeTypeStmtDecoder,
    CopyStmt: copyStmtDecoder,
    CreateCastStmt: createCastStmtDecoder,
    CreateConversionStmt: createConversionStmtDecoder,
    CreateDomainStmt: createDomainStmtDecoder,
    CreateEnumStmt: createEnumStmtDecoder,
    CreateEventTrigStmt: createEventTrigStmtDecoder,
    CreateFdwStmt: createFdwStmtDecoder,
    CreateForeignServerStmt: createForeignServerStmtDecoder,
    CreateFunctionStmt: createFunctionStmtDecoder,
    CreateOpClassStmt: createOpClassStmtDecoder,
    CreateOpFamilyStmt: createOpFamilyStmtDecoder,
    CreatePLangStmt: createPLangStmtDecoder,
    CreatePolicyStmt: createPolicyStmtDecoder,
    CreateRangeStmt: createRangeStmtDecoder,
    CreateRoleStmt: createRoleStmtDecoder,
    CreateSchemaStmt: createSchemaStmtDecoder,
    CreateSeqStmt: createSeqStmtDecoder,
    CreateStatsStmt: createStatsStmtDecoder,
    CreateStmt: createStmtDecoder,
    CreateTableAsStmt: createTableAsStmtDecoder,
    CreateTrigStmt: createTrigStmtDecoder,
    DeallocateStmt: deallocateStmtDecoder,
    DeclareCursorStmt: declareCursorStmtDecoder,
    DefineStmt: defineStmtDecoder,
    DeleteStmt: deleteStmtDecoder,
    DiscardStmt: discardStmtDecoder,
    DoStmt: doStmtDecoder,
    DropRoleStmt: dropRoleStmtDecoder,
    DropStmt: dropStmtDecoder,
    ExecuteStmt: executeStmtDecoder,
    ExplainStmt: explainStmtDecoder,
    FetchStmt: fetchStmtDecoder,
    GrantStmt: grantStmtDecoder,
    IndexStmt: indexStmtDecoder,
    InsertStmt: insertStmtDecoder,
    ListenStmt: listenStmtDecoder,
    LockStmt: lockStmtDecoder,
    NotifyStmt: notifyStmtDecoder,
    PrepareStmt: prepareStmtDecoder,
    ReindexStmt: reindexStmtDecoder,
    RenameStmt: renameStmtDecoder,
    RuleStmt: ruleStmtDecoder,
    SecLabelStmt: secLabelStmtDecoder,
    SelectStmt: selectStmtDecoder,
    TransactionStmt: transactionStmtDecoder,
    TruncateStmt: truncateStmtDecoder,
    UnlistenStmt: unlistenStmtDecoder,
    UpdateStmt: updateStmtDecoder,
    VacuumStmt: vacuumStmtDecoder,
    VariableSetStmt: variableSetStmtDecoder,
    VariableShowStmt: variableShowStmtDecoder,
    ViewStmt: viewStmtDecoder,
    Comment: commentDecoder,
  }),
});

export type StatementType = KeysOfUnion<Stmt["stmt"]>;
