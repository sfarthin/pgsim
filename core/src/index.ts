import { Schema, Query } from "./toParser";
import toResultType from "./toResultType";
import toLinter, { LintError, LintOptions } from "./toLinter";
import toParser from "./toParser";
import { fromFiles, fromString } from "./toSql";
import toArray from "./iteratorToArray";
import toSchema from "./toSchema";
import { PGError, PGErrorCode } from "./errors";

export { PGErrorCode };

export function lintString(
  str: string,
  options: LintOptions | void,
  schema: Schema | void
): LintError[] {
  return toArray(toLinter(fromString(str), options, schema));
}

export function lintFiles(
  files: string[],
  options: LintOptions | void,
  schema: Schema | void
): LintError[] {
  return toArray(toLinter(fromFiles(files), options, schema));
}

export function getSingleQuery(str: string): Query {
  const queries = toArray(toParser(fromString(str)));

  if (queries.length !== 1) {
    throw new PGError(PGErrorCode.INVALID, "Expected Single Query");
  }
  const { query } = queries[0];

  return query;
}

export function toSchemaFromString(str: string): Schema {
  return toSchema(toParser(fromString(str)));
}
