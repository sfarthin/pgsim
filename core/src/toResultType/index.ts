import { Schema, Query } from "../toParser";
import { Field } from "./types";
import { emptySchema } from "../toSchema";
import { fromSelect } from "./selectStmt";

export default function toResultType(
  query: Query,
  text: string = "",
  schema: Schema = emptySchema
): { type: Field[]; text: string } {
  if ("SelectStmt" in query) {
    return { type: fromSelect(schema, query.SelectStmt), text };
  } else {
    throw new Error(`Todo ${Object.keys(query)[0]}`);
  }
}
