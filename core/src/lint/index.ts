import { Schema } from "../parse";
import toSchema, { emptySchema } from "../toSchema";
import { PGErrorCode } from "../errors";
import toReader from "../toReader";

type LintError = { error: PGErrorCode; message: string };

type Options = {
  // We queries should we expect.
  type?: "SCHEMA" | "QUERY";
  // Should make sure all fields are snake case.
  case?: "SNAKE" | "CAMEL";
  // Should we enforce a consistent naming structure for constraint names.
  constraintName?: true;
  // Should we disable triggers
  noTriggers?: true;
  // Should we disable functions
  noFunctions?: true;
  // aka do fields in SELECT match a known table.
  validateFieldReferences?: true;
  // Dissallow joining tables on fields that are not indexed.
  onlyJoinOnIndex?: true;
};

const defaultOptions: Options = {
  case: "SNAKE",
  constraintName: true,
  validateFieldReferences: true,
  onlyJoinOnIndex: true,
};

export default function lint(
  text: string,
  existingSchema: Schema = emptySchema,
  options: Options | void = defaultOptions
): LintError[] {
  let lintErrors: LintError[] = [];

  const reader = toReader(text);
  let curr = reader.next();
  let schema = existingSchema;

  while (!curr.done) {
    const { query, text } = curr.value;
    try {
      schema = toSchema(query, text, schema);
    } catch (e) {
      // Must not be a PGErrorCode.
      if (!e.id) {
        throw e;
      }

      lintErrors = lintErrors.concat([
        {
          error: e.id,
          message: String(e.message),
        },
      ]);
    }

    curr = reader.next();
  }

  return lintErrors;
}
