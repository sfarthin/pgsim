import { Schema, Query } from "../toParser";
import { Field } from "./types";
import { emptySchema } from "../toSchema";
import { fromSelect } from "./selectStmt";

export default function toResultType(
  query: Query,
  schema: Schema = emptySchema
): Field[] {
  if ("SelectStmt" in query) {
    return fromSelect(schema, query.SelectStmt);
  } else {
    throw new Error(`Todo ${Object.keys(query)[0]}`);
  }
}
