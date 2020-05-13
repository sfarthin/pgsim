import { Schema, CreateStmt } from "../parse";
import { PGErrorCode, PGError } from "../errors";
import { toTableField, toTableName } from "./toTableField";

export default function createStmt(
  createStmt: CreateStmt,
  text: string,
  schema: Schema
): Schema {
  const tables = schema.tables;
  const name = toTableName(createStmt);

  // Make sure there are no other tables with this name
  const duplicateTable = tables.find(({ def }) => toTableName(def) === name);

  if (duplicateTable) {
    throw new PGError(
      PGErrorCode.NOT_ALLOWED,
      `Cannot create the "${name}" table twice`
    );
  }

  const fields = [];
  for (let { ColumnDef: columnDef } of createStmt.tableElts) {
    fields.push(toTableField(columnDef));
  }

  const newTable = { fields, def: createStmt, text: [text] };

  return {
    ...schema,
    tables: schema.tables.concat(newTable),
  };
}
