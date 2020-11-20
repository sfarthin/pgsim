import { CreateSeqStmt } from "../toParser";
// import { PGErrorCode, PGError } from "../errors";
import { Schema } from "./";

export default function createStmt(
  createSeqStmt: CreateSeqStmt,
  schema: Schema
): Schema {
  return {
    ...schema,
    sequences: schema.sequences.concat(createSeqStmt),
  };
}
