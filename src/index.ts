import parse from "~/nativeParse";
import toLinter, { LintError, LintOptions } from "~/toLinter";
import {
  fromFilesToSqlIterator,
  fromStringToSqlIterator,
} from "~/util/toSqlIterator";
import toArray from "~/util/iteratorToArray";
import toSchema, { toTableFields, Schema } from "~/toSchema";
import { PGErrorCode } from "~/util/errors";

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

export function toSchemaFromString(str: string): Schema {
  return toSchema(parse(str));
}

export { parse };
