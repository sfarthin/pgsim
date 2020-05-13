import {
  TableSchema,
  ColumnDef,
  isNullable,
  getReference,
  isPrimaryKey,
  getPrimitiveType,
  TableField,
  CreateStmt,
  AlterTableStmt,
} from "../toParser";

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

export function addFieldToTable(
  tableSchema: TableSchema,
  text: string,
  columnDef: ColumnDef
) {
  const def = {
    ...tableSchema.def,
    tableElts: tableSchema.def.tableElts.concat({ ColumnDef: columnDef }),
  };

  return {
    ...tableSchema,
    text: tableSchema.text.concat(text),
    fields: tableSchema.fields.concat(toTableField(columnDef)),
    def,
  };
}
