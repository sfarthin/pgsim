import {
  ColumnDef,
  isNullable,
  getReference,
  isPrimaryKey,
  getPrimitiveType,
  TableField,
  CreateStmt,
  AlterTableStmt,
} from "../parse";

export function toTableName(c: CreateStmt | AlterTableStmt): string {
  return c.relation.RangeVar.relname;
}

export function toTableField(columnDef: ColumnDef): TableField {
  return {
    name: columnDef.colname,
    type: getPrimitiveType(columnDef),
    isNullable: isNullable(columnDef.constraints),
    references: getReference(columnDef.constraints),
    isPrimaryKey: isPrimaryKey(columnDef.constraints),
  };
}
