import { CreateSeqStmt } from "~/types";
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
