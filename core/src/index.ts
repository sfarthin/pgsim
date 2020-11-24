import parse, { Stmt } from "./toParser";
import toLinter, { LintError, LintOptions } from "./toLinter";
import toString from "./toString";
import {
  fromFilesToSqlIterator,
  fromStringToSqlIterator,
} from "./toSqlIterator";
import toArray from "./iteratorToArray";
import toSchema, { toTableFields, Schema } from "./toSchema";
import { PGError, PGErrorCode } from "./errors";

export { PGErrorCode, toTableFields, LintOptions, toArray };

export function lintString(
  str: string,
  options: LintOptions | void,
  schema: Schema | void
): Iterator<LintError, void> {
  return toLinter(fromStringToSqlIterator(str), options, schema);
}

export function lintFiles(
  files: string[],
  options: LintOptions | void,
  schema: Schema | void
): Iterator<LintError, void> {
  return toLinter(fromFilesToSqlIterator(files), options, schema);
}

export function lintStream(
  stream: Iterator<string>,
  options: LintOptions | void,
  schema: Schema | void
): Iterator<LintError, void> {
  return toLinter(stream, options, schema);
}

export function getSingleQuery(str: string): Stmt {
  const statements = parse(str);

  if (statements.length !== 1) {
    throw new PGError(PGErrorCode.INVALID, "Expected Single Query");
  }
  return statements[0];
}

export function toSchemaFromString(str: string): Schema {
  return toSchema(parse(str));
}

export function format(str: string): string {
  const queries = parse(str);
  return queries.map(toString).join("\n");
}

export { parse };
