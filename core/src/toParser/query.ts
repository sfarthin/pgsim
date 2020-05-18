import { array, exact, mixed, Decoder, either9 } from "decoders";
import { CreateStmt, createStmtDecoder, ColumnDef } from "./createStmt";
import { AlterTableStmt, alterTableStmtDecoder } from "./alterTableStmt";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { PGError, PGErrorCode } from "../errors";
// import { DropStmt, dropStmtDecoder } from "./dropTable";
import { insertStmtDecoder, InsertStmt } from "./insertStmt";

export type Query =
  | { CreateStmt: CreateStmt }
  | { AlterTableStmt: AlterTableStmt }
  | { InsertStmt: InsertStmt }
  | { SelectStmt: SelectStmt }
  | { IndexStmt: unknown }
  | { UpdateStmt: unknown }
  | { VariableSetStmt: unknown }
  | { CreateEnumStmt: unknown }
  | { CreateSeqStmt: unknown }
  | { CreateRoleStmt: unknown }
  | { AlterSeqStmt: unknown }
  | { ViewStmt: unknown }
  | { DropStmt: unknown }
  | { DefineStmt: unknown }
  | { CreateFunctionStmt: unknown }
  | { CreateCastStmt: unknown }
  | { DeleteStmt: unknown }
  | { CreateRangeStmt: unknown }
  | { TruncateStmt: unknown }
  | { ExplainStmt: unknown }
  | { DropRoleStmt: unknown }
  | { CreateTableAsStmt: unknown }
  | { TransactionStmt: unknown } // BEGIN...END
  | { VariableShowStmt: unknown } // SHOW DateStyle;
  | { DoStmt: unknown }
  | { VacuumStmt: unknown }
  | { AlterRoleStmt: unknown }
  | { CreateSchemaStmt: unknown }
  | { CreateSchemaStmt: unknown }
  | { AlterDefaultPrivilegesStmt: unknown }
  | { GrantStmt: unknown }
  | { DeclareCursorStmt: unknown }
  | { CopyStmt: unknown }
  | { CreateDomainStmt: unknown }
  | { FetchStmt: unknown }
  | { ClosePortalStmt: unknown }
  | { PrepareStmt: unknown }
  | { ExecuteStmt: unknown }
  | { RuleStmt: unknown }
  | { ReindexStmt: unknown }
  | { SecLabelStmt: unknown }
  | { AlterRoleSetStmt: unknown }
  | { LockStmt: unknown }
  | { RenameStmt: unknown }
  | { NotifyStmt: unknown }
  | { ListenStmt: unknown }
  | { UnlistenStmt: unknown }
  | { DiscardStmt: unknown }
  | { AlterFunctionStmt: unknown }
  | { AlterTSDictionaryStmt: unknown }
  | { AlterTSConfigurationStmt: unknown }
  | { CreateTrigStmt: unknown }
  | { AlterOpFamilyStmt: unknown }
  | { CreatePolicyStmt: unknown }
  | { CompositeTypeStmt: unknown }
  | { DeallocateStmt: unknown }
  | { CreateConversionStmt: unknown }
  | { CommentStmt: unknown };

export const queryDecoder: Decoder<Query> = either9(
  exact({ CreateStmt: createStmtDecoder }),
  exact({ AlterTableStmt: alterTableStmtDecoder }),
  exact({ InsertStmt: insertStmtDecoder }),
  exact({ SelectStmt: selectStmtDecoder }),
  exact({ IndexStmt: mixed }),
  exact({ UpdateStmt: mixed }),
  exact({ VariableSetStmt: mixed }),
  exact({ CreateEnumStmt: mixed }),
  either9(
    exact({ CreateSeqStmt: mixed }),
    exact({ AlterSeqStmt: mixed }),
    exact({ ViewStmt: mixed }),
    exact({ DropStmt: mixed }),
    exact({ DefineStmt: mixed }),
    exact({ CreateFunctionStmt: mixed }),
    exact({ CreateCastStmt: mixed }),
    exact({ DeleteStmt: mixed }),
    either9(
      exact({ CreateRangeStmt: mixed }),
      exact({ TruncateStmt: mixed }),
      exact({ ExplainStmt: mixed }),
      exact({ CreateRoleStmt: mixed }),
      exact({ DropRoleStmt: mixed }),
      exact({ CreateTableAsStmt: mixed }),
      exact({ TransactionStmt: mixed }),
      exact({ VariableShowStmt: mixed }),
      either9(
        exact({ DoStmt: mixed }),
        exact({ VacuumStmt: mixed }),
        exact({ AlterRoleStmt: mixed }),
        exact({ CreateSchemaStmt: mixed }),
        exact({ AlterDefaultPrivilegesStmt: mixed }),
        exact({ GrantStmt: mixed }),
        exact({ DeclareCursorStmt: mixed }),
        exact({ CopyStmt: mixed }),
        either9(
          exact({ CreateDomainStmt: mixed }),
          exact({ FetchStmt: mixed }),
          exact({ ClosePortalStmt: mixed }),
          exact({ PrepareStmt: mixed }),
          exact({ ExecuteStmt: mixed }),
          exact({ RuleStmt: mixed }),
          exact({ ReindexStmt: mixed }),
          exact({ SecLabelStmt: mixed }),
          either9(
            exact({ AlterRoleSetStmt: mixed }),
            exact({ LockStmt: mixed }),
            exact({ RenameStmt: mixed }),
            exact({ NotifyStmt: mixed }),
            exact({ ListenStmt: mixed }),
            exact({ UnlistenStmt: mixed }),
            exact({ DiscardStmt: mixed }),
            exact({ AlterFunctionStmt: mixed }),
            either9(
              exact({ AlterTSConfigurationStmt: mixed }),
              exact({ AlterTSDictionaryStmt: mixed }),
              exact({ CreateTrigStmt: mixed }),
              exact({ AlterOpFamilyStmt: mixed }),
              exact({ CreatePolicyStmt: mixed }),
              exact({ CompositeTypeStmt: mixed }),
              exact({ DeallocateStmt: mixed }),
              exact({ CreateConversionStmt: mixed }),
              exact({ CommentStmt: mixed })
            )
          )
        )
      )
    )
  )
);

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

export function getPrimitiveType(columnDef: ColumnDef): PrimitiveType {
  const names = columnDef.typeName.TypeName.names
    .map((s) => s.String.str)
    .filter((s) => s !== "pg_catalog");

  if (names.length !== 1) {
    throw new Error("Unexpected type count");
  }

  const name = names[0];

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
      throw new PGError(
        PGErrorCode.NOT_UNDERSTOOD,
        `Unexpected type "${name}"`
      );
  }
}

export type TableField = {
  name: string;
  type: PrimitiveType;
  isNullable: boolean;
  references: { tablename: string; colname: string } | null;
  isPrimaryKey: boolean;
};

export type Schema = {
  tables: CreateStmt[];
  constraints: unknown; // <-- To be foreign key references and indicies
};

export type Queries = Query[];
export type QueryWithText = { query: Query; text: string };
export const queriesDecoder: Decoder<Queries> = array(queryDecoder);
