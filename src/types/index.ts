import { inexact, pojo, Decoder, either9, either6, string } from "decoders";
import { CreateStmt, createStmtDecoder } from "./createStmt";
import { AlterTableStmt, alterTableStmtDecoder } from "./alterTableStmt";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { CreateSeqStmt, createSeqStmtDecoder } from "./createSeqStmt";
import { AlterSeqStmt, alterSeqStmtDecoder } from "./alterSeqStmt";
import { insertStmtDecoder, InsertStmt } from "./insertStmt";
import { VariableSetStmt, variableSetStmtDecoder } from "./variableSetStmt";
import { CreateEnumStmt, createEnumStmtDecoder } from "./createEnumStmt";

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

export type Stmt = {
  RawStmt: {
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

export const stmtDecoder: Decoder<Stmt> = inexact({
  RawStmt: inexact({
    stmt: either9(
      inexact({ CreateStmt: createStmtDecoder }),
      inexact({ AlterTableStmt: alterTableStmtDecoder }),
      inexact({ InsertStmt: insertStmtDecoder }),
      inexact({ SelectStmt: selectStmtDecoder }),
      inexact({ CreateSeqStmt: createSeqStmtDecoder }),
      inexact({ VariableSetStmt: variableSetStmtDecoder }),
      inexact({ CreateEnumStmt: createEnumStmtDecoder }),
      inexact({ AlterSeqStmt: alterSeqStmtDecoder }),
      either9(
        inexact({ Comment: string }),
        inexact({ IndexStmt: pojo }),
        inexact({ UpdateStmt: pojo }),
        inexact({ ViewStmt: pojo }),
        inexact({ DropStmt: pojo }),
        inexact({ DefineStmt: pojo }),
        inexact({ CreateFunctionStmt: pojo }),
        inexact({ CreateCastStmt: pojo }),
        either9(
          inexact({ DeleteStmt: pojo }),
          inexact({ CreateRangeStmt: pojo }),
          inexact({ TruncateStmt: pojo }),
          inexact({ ExplainStmt: pojo }),
          inexact({ CreateRoleStmt: pojo }),
          inexact({ DropRoleStmt: pojo }),
          inexact({ CreateTableAsStmt: pojo }),
          inexact({ TransactionStmt: pojo }),
          either9(
            inexact({ VariableShowStmt: pojo }),
            inexact({ VacuumStmt: pojo }),
            inexact({ AlterRoleStmt: pojo }),
            inexact({ CreateSchemaStmt: pojo }),
            inexact({ AlterDefaultPrivilegesStmt: pojo }),
            inexact({ GrantStmt: pojo }),
            inexact({ DeclareCursorStmt: pojo }),
            inexact({ CopyStmt: pojo }),
            either9(
              inexact({ CreateDomainStmt: pojo }),
              inexact({ FetchStmt: pojo }),
              inexact({ ClosePortalStmt: pojo }),
              inexact({ PrepareStmt: pojo }),
              inexact({ ExecuteStmt: pojo }),
              inexact({ RuleStmt: pojo }),
              inexact({ ReindexStmt: pojo }),
              inexact({ SecLabelStmt: pojo }),
              either9(
                inexact({ AlterRoleSetStmt: pojo }),
                inexact({ LockStmt: pojo }),
                inexact({ RenameStmt: pojo }),
                inexact({ NotifyStmt: pojo }),
                inexact({ ListenStmt: pojo }),
                inexact({ UnlistenStmt: pojo }),
                inexact({ DiscardStmt: pojo }),
                inexact({ AlterFunctionStmt: pojo }),
                either9(
                  inexact({ AlterTSConfigurationStmt: pojo }),
                  inexact({ AlterTSDictionaryStmt: pojo }),
                  inexact({ CreateTrigStmt: pojo }),
                  inexact({ AlterOpFamilyStmt: pojo }),
                  inexact({ CreatePolicyStmt: pojo }),
                  inexact({ CompositeTypeStmt: pojo }),
                  inexact({ DeallocateStmt: pojo }),
                  inexact({ CreateConversionStmt: pojo }),
                  either9(
                    inexact({ CommentStmt: pojo }),
                    inexact({ AlterOwnerStmt: pojo }),
                    inexact({ AlterObjectSchemaStmt: pojo }),
                    inexact({ CreateFdwStmt: pojo }),
                    inexact({ CreateForeignServerStmt: pojo }),
                    inexact({ CreatePLangStmt: pojo }),
                    inexact({ CreateOpFamilyStmt: pojo }),
                    inexact({ CreateOpClassStmt: pojo }),
                    either6(
                      inexact({ DoStmt: pojo }),
                      inexact({ CreateStatsStmt: pojo }),
                      inexact({ AlterOperatorStmt: pojo }),
                      inexact({ ClusterStmt: pojo }),
                      inexact({ CreateEventTrigStmt: pojo }),
                      inexact({ AlterEnumStmt: pojo })
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeysOfUnion<T> = T extends any ? keyof T : never;
export type StatementType = KeysOfUnion<Stmt["RawStmt"]["stmt"]>;
