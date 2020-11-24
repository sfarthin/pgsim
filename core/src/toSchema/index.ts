import { CreateStmt, CreateSeqStmt, Constraint, Stmt } from "../toParser";
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

export function modifySchema(stmt: Stmt, _schema: Schema | void): Schema {
  const schema = _schema ? _schema : emptySchema;
  if ("CreateStmt" in stmt.RawStmt.stmt) {
    return createStmt(stmt.RawStmt.stmt.CreateStmt, schema);
  } else if ("AlterTableStmt" in stmt.RawStmt.stmt) {
    return alterTableStmt(stmt.RawStmt.stmt.AlterTableStmt, schema);
  } else if ("CreateSeqStmt" in stmt.RawStmt.stmt) {
    return createSeqStmt(stmt.RawStmt.stmt.CreateSeqStmt, schema);
  } else if ("SelectStmt" in stmt.RawStmt.stmt) {
    return schema;
  }

  throw new PGError(
    PGErrorCode.NOT_UNDERSTOOD,
    `Query table not handled: ${Object.keys(stmt.RawStmt.stmt)[0]}`
  );
}

export default function toSchema(
  statements: Stmt[],
  _schema: Schema | void
): Schema {
  let schema = _schema ? _schema : emptySchema;

  for (const statement of statements) {
    schema = modifySchema(statement, schema);
  }

  return schema;
}
