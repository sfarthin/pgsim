import {
  Parser,
  CreateStmt,
  CreateSeqStmt,
  Constraint,
  Query,
} from "../toParser";
import createStmt from "./createStmt";
import alterTableStmt from "./alterTableStmt";
import createSeqStmt from "./createSeqStmt";
import { PGError, PGErrorCode } from "../errors";

export { toTableFields } from "./toTableField";

export type Schema = {
  tables: CreateStmt[];
  constraints: Constraint[]; // <-- To be foreign key references and indicies
  sequences: CreateSeqStmt[];
};

export const emptySchema = {
  tables: [],
  constraints: [],
  sequences: [],
};

export function modifySchema(query: Query, _schema: Schema | void): Schema {
  const schema = _schema ? _schema : emptySchema;
  if ("CreateStmt" in query.RawStmt.stmt) {
    return createStmt(query.RawStmt.stmt.CreateStmt, schema);
  } else if ("AlterTableStmt" in query.RawStmt.stmt) {
    return alterTableStmt(query.RawStmt.stmt.AlterTableStmt, schema);
  } else if ("CreateSeqStmt" in query.RawStmt.stmt) {
    return createSeqStmt(query.RawStmt.stmt.CreateSeqStmt, schema);
  } else if ("SelectStmt" in query.RawStmt.stmt) {
    return schema;
  }

  throw new PGError(
    PGErrorCode.NOT_UNDERSTOOD,
    `Query table not handled: ${Object.keys(query.RawStmt.stmt)[0]}`
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
