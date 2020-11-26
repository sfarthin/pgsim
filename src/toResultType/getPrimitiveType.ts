import { ColumnDef } from "~/types";

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
