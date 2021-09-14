import * as d from "decoders";
import { String, stringDecoder } from "./constant";
import { TypeName, typeNameDecoder } from "./typeName";
import { DropBehavior, dropBehaviorDecoder } from "./dropBehavior";
import { List, listDecoder } from "./list";

export enum RemoveType {
  OBJECT_SEQUENCE = "OBJECT_SEQUENCE",
  OBJECT_TABLE = "OBJECT_TABLE",
  OBJECT_TYPE = "OBJECT_TYPE",
  OBJECT_VIEW = "OBJECT_VIEW",
}

type Objects = { List: List<{ String: String }> }[];
const objectsDecoder: d.Decoder<Objects> = d.array(
  d.exact({ List: listDecoder(stringDecoder) })
);

export type DropStmtSequence = {
  objects: Objects;
  removeType: RemoveType.OBJECT_SEQUENCE;
  behavior: DropBehavior;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtSequenceDecoder: d.Decoder<DropStmtSequence> = d.exact({
  objects: objectsDecoder,
  removeType: d.constant(RemoveType.OBJECT_SEQUENCE),
  behavior: dropBehaviorDecoder,
  missing_ok: d.optional(d.boolean),
});

export type DropStmtView = {
  objects: Objects;
  removeType: RemoveType.OBJECT_VIEW;
  behavior: DropBehavior;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtViewDecoder: d.Decoder<DropStmtView> = d.exact({
  objects: objectsDecoder,
  removeType: d.constant(RemoveType.OBJECT_VIEW),
  behavior: dropBehaviorDecoder,
  missing_ok: d.optional(d.boolean),
});

export type DropStmtTable = {
  objects: Objects;
  removeType: RemoveType.OBJECT_TABLE;
  behavior: DropBehavior;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtTableDecoder: d.Decoder<DropStmtTable> = d.exact({
  objects: objectsDecoder,
  removeType: d.constant(RemoveType.OBJECT_TABLE),
  behavior: dropBehaviorDecoder,
  missing_ok: d.optional(d.boolean),
});

export type DropStmtType = {
  objects: [{ TypeName: TypeName }];
  removeType: RemoveType.OBJECT_TYPE;
  behavior: DropBehavior;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtTypeDecoder: d.Decoder<DropStmtType> = d.exact({
  objects: d.tuple1(d.exact({ TypeName: typeNameDecoder })),
  removeType: d.constant(RemoveType.OBJECT_TYPE),
  behavior: dropBehaviorDecoder,
  missing_ok: d.optional(d.boolean),
});

export type DropStmt =
  | DropStmtSequence
  | DropStmtType
  | DropStmtTable
  | DropStmtView;

export const dropStmtDecoder: d.Decoder<DropStmt> = d.dispatch("removeType", {
  [RemoveType.OBJECT_SEQUENCE]: dropStmtSequenceDecoder,
  [RemoveType.OBJECT_VIEW]: dropStmtViewDecoder,
  [RemoveType.OBJECT_TABLE]: dropStmtTableDecoder,
  [RemoveType.OBJECT_TYPE]: dropStmtTypeDecoder,
});
