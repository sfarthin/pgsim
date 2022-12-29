import * as d from "decoders";
import { rangeVarDecoder } from "./rangeVar";
import { dropBehaviorDecoder } from "./dropBehavior";

export enum RenameType {
  OBJECT_COLUMN = "OBJECT_COLUMN",
  OBJECT_TABLE = "OBJECT_TABLE",
}

export enum RelationType {
  OBJECT_TABLE = "OBJECT_TABLE",
  OBJECT_ACCESS_METHOD = "OBJECT_ACCESS_METHOD",
}

export const renameColumnStmtDecoder = d.exact({
  renameType: d.constant(RenameType.OBJECT_COLUMN),
  relationType: d.constant(RelationType.OBJECT_TABLE),
  relation: rangeVarDecoder,
  subname: d.string,
  newname: d.string,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});
export type RenameColumnStmt = d.DecoderType<typeof renameColumnStmtDecoder>;

export const renameTableStmtDecoder = d.exact({
  renameType: d.constant(RenameType.OBJECT_TABLE),
  relationType: d.constant(RelationType.OBJECT_ACCESS_METHOD),
  relation: rangeVarDecoder,
  newname: d.string,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});
export type RenameTableStmt = d.DecoderType<typeof renameTableStmtDecoder>;

export type RenameStmt = RenameColumnStmt | RenameTableStmt;

export const renameStmtDecoder: d.Decoder<RenameStmt> = d.dispatch(
  "renameType",
  {
    [RenameType.OBJECT_TABLE]: renameTableStmtDecoder,
    [RenameType.OBJECT_COLUMN]: renameColumnStmtDecoder,
  }
);
