import { Query } from "./toParser";
import toLinter, { LintError, LintOptions } from "./toLinter";
import toParser from "./toParser";
import toDDL from "./toDDL";
import { fromFiles, fromString } from "./toSql";
import toArray from "./iteratorToArray";
import toSchema, { toTableFields, Schema } from "./toSchema";
import { PGError, PGErrorCode } from "./errors";

export { PGErrorCode, toTableFields, LintOptions, toArray };

export function lintString(
  str: string,
  options: LintOptions | void,
  schema: Schema | void
): Iterator<LintError, void> {
  return toLinter(fromString(str), options, schema);
}

export function lintFiles(
  files: string[],
  options: LintOptions | void,
  schema: Schema | void
): Iterator<LintError, void> {
  return toLinter(fromFiles(files), options, schema);
}

export function lintStream(
  stream: Iterator<string>,
  options: LintOptions | void,
  schema: Schema | void
): Iterator<LintError, void> {
  return toLinter(stream, options, schema);
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

export function toDDLFromString(str: string): string {
  return toDDL(toSchemaFromString(str));
}
