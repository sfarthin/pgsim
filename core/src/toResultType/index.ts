import parse, { Schema } from "../parse";
import { Field } from "./types";
import toOriginalText from "../toReader/toOriginalText";

import { fromSelect } from "./selectStmt";

export * from "./selectStmt";

export default function toResultType(
  schema: Schema,
  input: string
): { type: Field[]; text: string }[] {
  const queries = parse(input);

  const result = [];

  for (let query of queries) {
    const text = toOriginalText(input, queries.indexOf(query));
    if ("SelectStmt" in query) {
      result.push({ type: fromSelect(schema, query.SelectStmt), text });
    } else {
      throw new Error(`TODO ${Object.keys(query)[0]}`);
    }
  }

  return result;
}
