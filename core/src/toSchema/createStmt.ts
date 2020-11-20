import { CreateStmt } from "../toParser";
import { PGErrorCode, PGError } from "../errors";
import { toTableName } from "./toTableField";
import { Schema } from "./";

export default function createStmt(
  createStmt: CreateStmt,
  schema: Schema
): Schema {
  const tables = schema.tables;
  const name = toTableName(createStmt);

  // Make sure there are no other tables with this name
  const duplicateTable = tables.find((def) => toTableName(def) === name);

  if (duplicateTable) {
    throw new PGError(
      PGErrorCode.INVALID,
      `Cannot create the "${name}" table twice`
    );
  }

  // TODO Remove foriegn keys and indeicies
  // and put it in constraints.
  const newTable = createStmt;

  return {
    ...schema,
    tables: schema.tables.concat(newTable),
  };
}
