import { Parser, Schema, Query } from "../toParser";
import createStmt from "./createStmt";
import alterTableStmt from "./alterTableStmt";
import { PGError, PGErrorCode } from "../errors";

export { toTableFields } from "./toTableField";

export const emptySchema = {
  tables: [],
  constraints: [],
};

export function modifySchema(query: Query, _schema: Schema | void): Schema {
  const schema = _schema ? _schema : emptySchema;
  if ("CreateStmt" in query) {
    return createStmt(query.CreateStmt, schema);
  } else if ("AlterTableStmt" in query) {
    return alterTableStmt(query.AlterTableStmt, schema);
  } else if ("SelectStmt" in query) {
    return schema;
  }

  throw new PGError(
    PGErrorCode.NOT_UNDERSTOOD,
    `Query table not handled: ${Object.keys(query)[0]}`
  );
}

export default function toSchema(
  parser: Parser,
  _schema: Schema | void
): Schema {
  let schema = _schema ? _schema : emptySchema;
  let curr = parser.next();

  while (!curr.done) {
    const { query } = curr.value;
    schema = modifySchema(query, schema);
    curr = parser.next();
  }

  return schema;
}
