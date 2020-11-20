import { Query } from "../toParser";
import { Field } from "./types";
import { emptySchema, Schema } from "../toSchema";
import { fromSelect } from "./selectStmt";

export default function toResultType(
  query: Query,
  schema: Schema = emptySchema
): Field[] {
  const stmt = query.RawStmt.stmt;
  if ("SelectStmt" in stmt) {
    return fromSelect(schema, stmt.SelectStmt);
  } else {
    throw new Error(`Todo ${Object.keys(query)[0]}`);
  }
}
