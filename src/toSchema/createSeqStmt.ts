import { CreateSeqStmt } from "../decoder";
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
