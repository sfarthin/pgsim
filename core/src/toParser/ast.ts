import { inexact, pojo, Decoder, either9, either5 } from "decoders";
import { CreateStmt, createStmtDecoder, ColumnDef } from "./createStmt";
import { AlterTableStmt, alterTableStmtDecoder } from "./alterTableStmt";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { CreateSeqStmt, createSeqStmtDecoder } from "./createSeqStmt";
// import { DropStmt, dropStmtDecoder } from "./dropTable";
import { insertStmtDecoder, InsertStmt } from "./insertStmt";
import { VariableSetStmt, variableSetStmtDecoder } from "./variableSetStmt";
import { CreateEnumStmt, createEnumStmtDecoder } from "./createEnumStmt";

export type Stmt = {
  RawStmt: {
    stmt: // SUPPORTED START
    | { CreateStmt: CreateStmt } // 1
      | { AlterTableStmt: AlterTableStmt } // 2
      | { InsertStmt: InsertStmt } // 3
      | { SelectStmt: SelectStmt } // 4
      | { CreateSeqStmt: CreateSeqStmt }
      | { VariableSetStmt: VariableSetStmt }
      | { CreateEnumStmt: CreateEnumStmt }
      //
      | { IndexStmt: Record<string, unknown> } // 5
      | { UpdateStmt: Record<string, unknown> } // 6
      | { CommentStmt: Record<string, unknown> } // 8
      | { ViewStmt: Record<string, unknown> } // 9
      // SUPPORTED END
      | { TransactionStmt: Record<string, unknown> } // BEGIN...END
      | { CreateRoleStmt: Record<string, unknown> }
      | { AlterSeqStmt: Record<string, unknown> }
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
      inexact({ UpdateStmt: pojo }),
      either9(
        inexact({ IndexStmt: pojo }),
        inexact({ AlterSeqStmt: pojo }),
        inexact({ ViewStmt: pojo }),
        inexact({ DropStmt: pojo }),
        inexact({ DefineStmt: pojo }),
        inexact({ CreateFunctionStmt: pojo }),
        inexact({ CreateCastStmt: pojo }),
        inexact({ DeleteStmt: pojo }),
        either9(
          inexact({ CreateRangeStmt: pojo }),
          inexact({ TruncateStmt: pojo }),
          inexact({ ExplainStmt: pojo }),
          inexact({ CreateRoleStmt: pojo }),
          inexact({ DropRoleStmt: pojo }),
          inexact({ CreateTableAsStmt: pojo }),
          inexact({ TransactionStmt: pojo }),
          inexact({ VariableShowStmt: pojo }),
          either9(
            inexact({ DoStmt: pojo }),
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
                    either5(
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

export type PrimitiveType =
  | "smallint" // 2 bytes	small-range integer	-32768 to +32767
  | "integer" // 4 bytes	typical choice for integer	-2147483648 to +2147483647
  | "bigint" // 8 bytes	large-range integer	-9223372036854775808 to +9223372036854775807
  | "decimal" // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
  | "numeric" // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
  | "real" // 4 bytes	variable-precision, inexact	6 decimal digits precision
  | "double" // precision	8 bytes	variable-precision, inexact	15 decimal digits precision
  | "smallserial" // 2 bytes	small autoincrementing integer	1 to 32767
  | "serial" // 4 bytes	autoincrementing integer	1 to 2147483647
  | "bigserial"
  | "int4"
  | "int8"
  | "timestamptz"
  | "bigserial"
  | "varchar"
  | "text";

export type TableField = {
  name: string;
  type: PrimitiveType;
  isNullable: boolean;
  references: { tablename: string; colname: string } | null;
  isPrimaryKey: boolean;
};

export function getPrimitiveType(columnDef: ColumnDef): PrimitiveType {
  const names = columnDef.typeName.TypeName.names
    .map((s) => s.String.str)
    .filter((s) => s !== "pg_catalog");

  if (names.length !== 1) {
    throw new Error("Unexpected type count");
  }

  const name = names[0];
  // TODO Add https://www.postgresql.org/docs/9.5/datatype.html
  // and pojo.
  switch (name) {
    case "smallint": // 2 bytes	small-range integer	-32768 to +32767
    case "integer": // 4 bytes	typical choice for integer	-2147483648 to +2147483647
    case "bigint": // 8 bytes	large-range integer	-9223372036854775808 to +9223372036854775807
    case "decimal": // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
    case "numeric": // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
    case "real": // 4 bytes	variable-precision, inexact	6 decimal digits precision
    case "double": // precision	8 bytes	variable-precision, inexact	15 decimal digits precision
    case "smallserial": // 2 bytes	small autoincrementing integer	1 to 32767
    case "serial": // 4 bytes	autoincrementing integer	1 to 2147483647
    case "bigserial":
    case "int4":
    case "int8":
    case "timestamptz":
    case "varchar":
    case "text":
      return name;
    default:
      throw new Error(`Unexpected type "${name}"`);
  }
}
