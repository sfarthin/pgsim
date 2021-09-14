import * as d from "decoders";
import { String, stringDecoder } from "./constant";
import { TypeName, typeNameDecoder } from "./typeName";

export enum RemoveType {
  SEQUENCE = 33,
  TABLE = 37,
  TYPE = 45,
  VIEW = 47,
}

export type DropStmtSequence = {
  objects: [[{ String: String }]];
  removeType: RemoveType.SEQUENCE;
  behavior: number;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtSequenceDecoder: d.Decoder<DropStmtSequence> = d.exact({
  objects: d.tuple1(d.tuple1(stringDecoder)),
  removeType: d.constant(RemoveType.SEQUENCE),
  behavior: d.number,
  missing_ok: d.optional(d.boolean),
});

export type DropStmtView = {
  objects: [[{ String: String }]];
  removeType: RemoveType.VIEW;
  behavior: number;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtViewDecoder: d.Decoder<DropStmtView> = d.exact({
  objects: d.tuple1(d.tuple1(stringDecoder)),
  removeType: d.constant(RemoveType.VIEW),
  behavior: d.number,
  missing_ok: d.optional(d.boolean),
});

export type DropStmtTable = {
  objects: [[{ String: String }]];
  removeType: RemoveType.TABLE;
  behavior: number;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtTableDecoder: d.Decoder<DropStmtTable> = d.exact({
  objects: d.tuple1(d.tuple1(stringDecoder)),
  removeType: d.constant(RemoveType.TABLE),
  behavior: d.number,
  missing_ok: d.optional(d.boolean),
});

export type DropStmtType = {
  objects: [{ TypeName: TypeName }];
  removeType: RemoveType.TYPE;
  behavior: number;
  codeComment?: string;
  missing_ok?: boolean;
};
const dropStmtTypeDecoder: d.Decoder<DropStmtType> = d.exact({
  objects: d.tuple1(d.exact({ TypeName: typeNameDecoder })),
  removeType: d.constant(RemoveType.TYPE),
  behavior: d.number,
  missing_ok: d.optional(d.boolean),
});

export type DropStmt =
  | DropStmtSequence
  | DropStmtType
  | DropStmtTable
  | DropStmtView;

export const dropStmtDecoder: d.Decoder<DropStmt> = d.either4(
  dropStmtSequenceDecoder,
  dropStmtTypeDecoder,
  dropStmtViewDecoder,
  dropStmtTableDecoder
);
