import toParser, { Schema } from "../toParser";
import { modifySchema, emptySchema } from "../toSchema";
import { PGErrorCode } from "../errors";
import toResultType from "../toResultType";

export type LintError = {
  sql: string | null;
  index: number | null;
  code: PGErrorCode;
  message: string;
};

export type LintOptions = {
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

const defaultOptions: LintOptions = {
  case: "SNAKE",
  constraintName: true,
  validateFieldReferences: true,
  onlyJoinOnIndex: true,
};

export default function* toLinter(
  sqlIterator: Iterator<string, void>,
  _options: LintOptions | void,
  existingSchema: Schema | void
): Iterator<LintError, void> {
  let lintErrors: LintError[] = [];
  let index = 0;
  try {
    const parser = toParser(sqlIterator);
    let curr = parser.next();
    let schema = existingSchema ? existingSchema : emptySchema;
    const options = _options ? _options : defaultOptions;

    while (!curr.done) {
      try {
        const { query, text } = curr.value;
        const resultType = toResultType(query, text, schema);

        // TODO process query and resultType

        schema = modifySchema(query, text, schema);
      } catch (e) {
        /**
         * This catch block catches errors when processing
         * the of a query. We continue processing in this case.
         */

        if (!e.id) {
          throw e;
        }

        yield {
          sql: curr && typeof curr.value === "string" ? curr.value : null,
          index,
          code: e.id,
          message: String(e.message),
        };
      }

      index++;
      curr = parser.next();
    }
  } catch (e) {
    /**
     * This catch block catches errors when
     * the postgres parser fails. We will stop
     * processing queries after this.
     */

    if (!e.id) {
      throw e;
    }

    yield {
      sql: null,
      index,
      code: e.id,
      message: String(e.message),
    };
  }
}
