import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { DropBehavior, dropBehaviorDecoder } from "./dropBehavior";

export enum RenameType {
  OBJECT_COLUMN = "OBJECT_COLUMN",
}

export enum RelationType {
  OBJECT_TABLE = "OBJECT_TABLE",
}

export type RenameStmt = {
  renameType: RenameType.OBJECT_COLUMN;
  relationType: RelationType.OBJECT_TABLE;
  relation: RangeVar;
  subname: string;
  newname: string;
  behavior: DropBehavior;
  codeComment?: string;
};

export const renameStmtDecoder: d.Decoder<RenameStmt> = d.exact({
  renameType: d.constant(RenameType.OBJECT_COLUMN),
  relationType: d.constant(RelationType.OBJECT_TABLE),
  relation: rangeVarDecoder,
  subname: d.string,
  newname: d.string,
  behavior: dropBehaviorDecoder,
  codeComment: d.optional(d.string),
});
