import * as d from "decoders";
import { String, stringDecoder } from "./constant";
import { typeNameDecoder } from "./typeName";
import { dropBehaviorDecoder } from "./dropBehavior";
import { List, listDecoder } from "./list";

export enum RemoveType {
  OBJECT_SEQUENCE = "OBJECT_SEQUENCE",
  OBJECT_TABLE = "OBJECT_TABLE",
  OBJECT_TYPE = "OBJECT_TYPE",
  OBJECT_VIEW = "OBJECT_VIEW",
  OBJECT_MATVIEW = "OBJECT_MATVIEW",
  OBJECT_INDEX = "OBJECT_INDEX",
}

type Objects = { List: List<{ String: String }> }[];
const objectsDecoder: d.Decoder<Objects> = d.array(
  d.exact({ List: listDecoder(stringDecoder) })
);

const dropStmtTypeDecoder = d.exact({
  objects: d.tuple1(d.exact({ TypeName: typeNameDecoder })),
  removeType: d.constant(RemoveType.OBJECT_TYPE),
  behavior: dropBehaviorDecoder,
  missing_ok: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
type DropStmtType = d.DecoderType<typeof dropStmtTypeDecoder>;

const dropIndexDecoder = d.exact({
  objects: objectsDecoder,
  removeType: d.constant(RemoveType.OBJECT_INDEX),
  behavior: dropBehaviorDecoder,
  concurrent: d.boolean,
  missing_ok: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
type DropIndexStmt = d.DecoderType<typeof dropIndexDecoder>;

const generalDropStmtDecoder = d.exact({
  objects: objectsDecoder,
  removeType: d.either4(
    d.constant(RemoveType.OBJECT_SEQUENCE),
    d.constant(RemoveType.OBJECT_VIEW),
    d.constant(RemoveType.OBJECT_TABLE),
    d.constant(RemoveType.OBJECT_MATVIEW)
  ),
  behavior: dropBehaviorDecoder,
  missing_ok: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
type GeneralDropStmt = d.DecoderType<typeof generalDropStmtDecoder>;

export type DropStmt = GeneralDropStmt | DropIndexStmt | DropStmtType;

export const dropStmtDecoder: d.Decoder<DropStmt> = d.dispatch("removeType", {
  [RemoveType.OBJECT_SEQUENCE]: generalDropStmtDecoder,
  [RemoveType.OBJECT_VIEW]: generalDropStmtDecoder,
  [RemoveType.OBJECT_TABLE]: generalDropStmtDecoder,
  [RemoveType.OBJECT_TYPE]: dropStmtTypeDecoder,
  [RemoveType.OBJECT_MATVIEW]: generalDropStmtDecoder,
  [RemoveType.OBJECT_INDEX]: dropIndexDecoder,
});
