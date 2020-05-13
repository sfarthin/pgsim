import { Schema, Query } from "../parse";
import createStmt from "./createStmt";
import alterTableStmt from "./alterTableStmt";
import { PGError, PGErrorCode } from "../errors";

export const emptySchema = {
  tables: [],
};

export default function toSchema(
  query: Query,
  text: string = "",
  schema: Schema
): Schema {
  if ("CreateStmt" in query) {
    return createStmt(query.CreateStmt, text, schema);
  } else if ("AlterTableStmt" in query) {
    return alterTableStmt(query.AlterTableStmt, text, schema);
  } else if ("SelectStmt" in query) {
    return schema;
  }

  throw new PGError(
    PGErrorCode.NOT_UNDERSTOOD,
    `Query table not handled: ${Object.keys(query)[0]}`
  );
}
