import { Decoder } from "decoders";
import { CreateStmt } from "./createStmt";
import { AlterTableStmt } from "./alterTableStmt";
import { SelectStmt } from "./selectStmt";
import { CreateSeqStmt } from "./createSeqStmt";
import { AlterSeqStmt } from "./alterSeqStmt";
import { InsertStmt } from "./insertStmt";
import { VariableSetStmt } from "./variableSetStmt";
import { CreateEnumStmt } from "./createEnumStmt";
export * from "./aExpr";
export * from "./alias";
export * from "./alterSeqStmt";
export * from "./alterTableStmt";
export * from "./booleanTest";
export * from "./boolExpr";
export * from "./columnRef";
export * from "./constant";
export * from "./constraint";
export * from "./createEnumStmt";
export * from "./createSeqStmt";
export * from "./createStmt";
export * from "./defElem";
export * from "./dropTable";
export * from "./fromClause";
export * from "./funcCall";
export * from "./InsertStmt";
export * from "./joinExpr";
export * from "./nullTest";
export * from "./rangeVar";
export * from "./selectStmt";
export * from "./targetValue";
export * from "./tuple1";
export * from "./typeCast";
export * from "./variableSetStmt";
export declare type Stmt = {
    RawStmt: {
        stmt: {
            CreateStmt: CreateStmt;
        } | {
            AlterTableStmt: AlterTableStmt;
        } | {
            InsertStmt: InsertStmt;
        } | {
            SelectStmt: SelectStmt;
        } | {
            CreateSeqStmt: CreateSeqStmt;
        } | {
            VariableSetStmt: VariableSetStmt;
        } | {
            CreateEnumStmt: CreateEnumStmt;
        } | {
            AlterSeqStmt: AlterSeqStmt;
        } | {
            IndexStmt: Record<string, unknown>;
        } | {
            UpdateStmt: Record<string, unknown>;
        } | {
            CommentStmt: Record<string, unknown>;
        } | {
            ViewStmt: Record<string, unknown>;
        } | {
            TransactionStmt: Record<string, unknown>;
        } | {
            CreateRoleStmt: Record<string, unknown>;
        } | {
            DropStmt: Record<string, unknown>;
        } | {
            DefineStmt: Record<string, unknown>;
        } | {
            CreateFunctionStmt: Record<string, unknown>;
        } | {
            CreateCastStmt: Record<string, unknown>;
        } | {
            DeleteStmt: Record<string, unknown>;
        } | {
            CreateRangeStmt: Record<string, unknown>;
        } | {
            TruncateStmt: Record<string, unknown>;
        } | {
            ExplainStmt: Record<string, unknown>;
        } | {
            DropRoleStmt: Record<string, unknown>;
        } | {
            CreateTableAsStmt: Record<string, unknown>;
        } | {
            VariableShowStmt: Record<string, unknown>;
        } | {
            DoStmt: Record<string, unknown>;
        } | {
            VacuumStmt: Record<string, unknown>;
        } | {
            AlterRoleStmt: Record<string, unknown>;
        } | {
            CreateSchemaStmt: Record<string, unknown>;
        } | {
            CreateSchemaStmt: Record<string, unknown>;
        } | {
            AlterDefaultPrivilegesStmt: Record<string, unknown>;
        } | {
            GrantStmt: Record<string, unknown>;
        } | {
            DeclareCursorStmt: Record<string, unknown>;
        } | {
            CopyStmt: Record<string, unknown>;
        } | {
            CreateDomainStmt: Record<string, unknown>;
        } | {
            FetchStmt: Record<string, unknown>;
        } | {
            ClosePortalStmt: Record<string, unknown>;
        } | {
            PrepareStmt: Record<string, unknown>;
        } | {
            ExecuteStmt: Record<string, unknown>;
        } | {
            RuleStmt: Record<string, unknown>;
        } | {
            ReindexStmt: Record<string, unknown>;
        } | {
            SecLabelStmt: Record<string, unknown>;
        } | {
            AlterRoleSetStmt: Record<string, unknown>;
        } | {
            LockStmt: Record<string, unknown>;
        } | {
            RenameStmt: Record<string, unknown>;
        } | {
            NotifyStmt: Record<string, unknown>;
        } | {
            ListenStmt: Record<string, unknown>;
        } | {
            UnlistenStmt: Record<string, unknown>;
        } | {
            DiscardStmt: Record<string, unknown>;
        } | {
            AlterFunctionStmt: Record<string, unknown>;
        } | {
            AlterTSDictionaryStmt: Record<string, unknown>;
        } | {
            AlterTSConfigurationStmt: Record<string, unknown>;
        } | {
            CreateTrigStmt: Record<string, unknown>;
        } | {
            AlterOpFamilyStmt: Record<string, unknown>;
        } | {
            CreatePolicyStmt: Record<string, unknown>;
        } | {
            CompositeTypeStmt: Record<string, unknown>;
        } | {
            DeallocateStmt: Record<string, unknown>;
        } | {
            CreateConversionStmt: Record<string, unknown>;
        } | {
            AlterOwnerStmt: Record<string, unknown>;
        } | {
            AlterObjectSchemaStmt: Record<string, unknown>;
        } | {
            CreateFdwStmt: Record<string, unknown>;
        } | {
            CreateForeignServerStmt: Record<string, unknown>;
        } | {
            CreatePLangStmt: Record<string, unknown>;
        } | {
            CreateOpFamilyStmt: Record<string, unknown>;
        } | {
            CreateOpClassStmt: Record<string, unknown>;
        } | {
            CreateStatsStmt: Record<string, unknown>;
        } | {
            AlterOperatorStmt: Record<string, unknown>;
        } | {
            ClusterStmt: Record<string, unknown>;
        } | {
            CreateEventTrigStmt: Record<string, unknown>;
        } | {
            AlterEnumStmt: Record<string, unknown>;
        };
    };
};
export declare const stmtDecoder: Decoder<Stmt>;
declare type KeysOfUnion<T> = T extends any ? keyof T : never;
export declare type StatementType = KeysOfUnion<Stmt["RawStmt"]["stmt"]>;
