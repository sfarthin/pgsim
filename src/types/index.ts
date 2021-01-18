import { exact, pojo, Decoder, string, number, optional } from "decoders";
import { CreateStmt, createStmtDecoder } from "./createStmt";
import { AlterTableStmt, alterTableStmtDecoder } from "./alterTableStmt";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { CreateSeqStmt, createSeqStmtDecoder } from "./createSeqStmt";
import { AlterSeqStmt, alterSeqStmtDecoder } from "./alterSeqStmt";
import { insertStmtDecoder, InsertStmt } from "./insertStmt";
import { VariableSetStmt, variableSetStmtDecoder } from "./variableSetStmt";
import { CreateEnumStmt, createEnumStmtDecoder } from "./createEnumStmt";
import dispatch from "./dispatch";

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
export * from "./rawExpr";
export * from "./typeName";

export type Stmt = {
  RawStmt: {
    stmt_len?: number;
    stmt_location?: number;
    stmt: // SUPPORTED START
    | { CreateStmt: CreateStmt }
      | { AlterTableStmt: AlterTableStmt }
      | { InsertStmt: InsertStmt }
      | { SelectStmt: SelectStmt }
      | { CreateSeqStmt: CreateSeqStmt } // Parsed/Formatted
      | { VariableSetStmt: VariableSetStmt }
      | { CreateEnumStmt: CreateEnumStmt } // Parsed/Formatted
      | { AlterSeqStmt: AlterSeqStmt } // Parsed/Formatted
      | { IndexStmt: Record<string, unknown> }
      | { UpdateStmt: Record<string, unknown> }
      | { CommentStmt: Record<string, unknown> }
      | { ViewStmt: Record<string, unknown> }
      | { Comment: string } // <-- on our parser only, for trailing comments
      // SUPPORTED END
      | { TransactionStmt: Record<string, unknown> } // BEGIN...END
      | { CreateRoleStmt: Record<string, unknown> }
      | { DropStmt: Record<string, unknown> }
      | { DefineStmt: Record<string, unknown> }
      | { CreateFunctionStmt: Record<string, unknown> }
      | { CreateCastStmt: Record<string, unknown> }
      | { DeleteStmt: Record<string, unknown> }
      | { CreateRangeStmt: Record<string, unknown> }
      | { TruncateStmt: Record<string, unknown> }
      | { ExplainStmt: Record<string, unknown> }
      | { DropRoleStmt: Record<string, unknown> }
      | { CreateTableAsStmt: Record<string, unknown> }
      | { VariableShowStmt: Record<string, unknown> } // SHOW DateStyle;
      | { DoStmt: Record<string, unknown> }
      | { VacuumStmt: Record<string, unknown> }
      | { AlterRoleStmt: Record<string, unknown> }
      | { CreateSchemaStmt: Record<string, unknown> }
      | { CreateSchemaStmt: Record<string, unknown> }
      | { AlterDefaultPrivilegesStmt: Record<string, unknown> }
      | { GrantStmt: Record<string, unknown> }
      | { DeclareCursorStmt: Record<string, unknown> }
      | { CopyStmt: Record<string, unknown> }
      | { CreateDomainStmt: Record<string, unknown> }
      | { FetchStmt: Record<string, unknown> }
      | { ClosePortalStmt: Record<string, unknown> }
      | { PrepareStmt: Record<string, unknown> }
      | { ExecuteStmt: Record<string, unknown> }
      | { RuleStmt: Record<string, unknown> }
      | { ReindexStmt: Record<string, unknown> }
      | { SecLabelStmt: Record<string, unknown> }
      | { AlterRoleSetStmt: Record<string, unknown> }
      | { LockStmt: Record<string, unknown> }
      | { RenameStmt: Record<string, unknown> }
      | { NotifyStmt: Record<string, unknown> }
      | { ListenStmt: Record<string, unknown> }
      | { UnlistenStmt: Record<string, unknown> }
      | { DiscardStmt: Record<string, unknown> }
      | { AlterFunctionStmt: Record<string, unknown> }
      | { AlterTSDictionaryStmt: Record<string, unknown> }
      | { AlterTSConfigurationStmt: Record<string, unknown> }
      | { CreateTrigStmt: Record<string, unknown> }
      | { AlterOpFamilyStmt: Record<string, unknown> }
      | { CreatePolicyStmt: Record<string, unknown> }
      | { CompositeTypeStmt: Record<string, unknown> }
      | { DeallocateStmt: Record<string, unknown> }
      | { CreateConversionStmt: Record<string, unknown> }
      | { AlterOwnerStmt: Record<string, unknown> }
      | { AlterObjectSchemaStmt: Record<string, unknown> }
      | { CreateFdwStmt: Record<string, unknown> }
      | { CreateForeignServerStmt: Record<string, unknown> }
      | { CreatePLangStmt: Record<string, unknown> }
      | { CreateOpFamilyStmt: Record<string, unknown> }
      | { CreateOpClassStmt: Record<string, unknown> }
      | { CreateStatsStmt: Record<string, unknown> }
      | { AlterOperatorStmt: Record<string, unknown> }
      | { ClusterStmt: Record<string, unknown> }
      | { CreateEventTrigStmt: Record<string, unknown> }
      | { AlterEnumStmt: Record<string, unknown> };
  };
};

export const stmtDecoder: Decoder<Stmt> = exact({
  RawStmt: exact({
    stmt_len: optional(number),
    stmt_location: optional(number),
    stmt: dispatch({
      CreateStmt: createStmtDecoder,
      AlterTableStmt: alterTableStmtDecoder,
      InsertStmt: insertStmtDecoder,
      SelectStmt: selectStmtDecoder,
      CreateSeqStmt: createSeqStmtDecoder,
      VariableSetStmt: variableSetStmtDecoder,
      CreateEnumStmt: createEnumStmtDecoder,
      AlterSeqStmt: alterSeqStmtDecoder,
      Comment: string,
      IndexStmt: pojo,
      UpdateStmt: pojo,
      ViewStmt: pojo,
      DropStmt: pojo,
      DefineStmt: pojo,
      CreateFunctionStmt: pojo,
      CreateCastStmt: pojo,
      DeleteStmt: pojo,
      CreateRangeStmt: pojo,
      TruncateStmt: pojo,
      ExplainStmt: pojo,
      CreateRoleStmt: pojo,
      DropRoleStmt: pojo,
      CreateTableAsStmt: pojo,
      TransactionStmt: pojo,
      VariableShowStmt: pojo,
      VacuumStmt: pojo,
      AlterRoleStmt: pojo,
      CreateSchemaStmt: pojo,
      AlterDefaultPrivilegesStmt: pojo,
      GrantStmt: pojo,
      DeclareCursorStmt: pojo,
      CopyStmt: pojo,
      CreateDomainStmt: pojo,
      FetchStmt: pojo,
      ClosePortalStmt: pojo,
      PrepareStmt: pojo,
      ExecuteStmt: pojo,
      RuleStmt: pojo,
      ReindexStmt: pojo,
      SecLabelStmt: pojo,
      AlterRoleSetStmt: pojo,
      LockStmt: pojo,
      RenameStmt: pojo,
      NotifyStmt: pojo,
      ListenStmt: pojo,
      UnlistenStmt: pojo,
      DiscardStmt: pojo,
      AlterFunctionStmt: pojo,
      AlterTSConfigurationStmt: pojo,
      AlterTSDictionaryStmt: pojo,
      CreateTrigStmt: pojo,
      AlterOpFamilyStmt: pojo,
      CreatePolicyStmt: pojo,
      CompositeTypeStmt: pojo,
      DeallocateStmt: pojo,
      CreateConversionStmt: pojo,
      CommentStmt: pojo,
      AlterOwnerStmt: pojo,
      AlterObjectSchemaStmt: pojo,
      CreateFdwStmt: pojo,
      CreateForeignServerStmt: pojo,
      CreatePLangStmt: pojo,
      CreateOpFamilyStmt: pojo,
      CreateOpClassStmt: pojo,
      DoStmt: pojo,
      CreateStatsStmt: pojo,
      AlterOperatorStmt: pojo,
      ClusterStmt: pojo,
      CreateEventTrigStmt: pojo,
      AlterEnumStmt: pojo,
    }),
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeysOfUnion<T> = T extends any ? keyof T : never;
export type StatementType = KeysOfUnion<Stmt["RawStmt"]["stmt"]>;
