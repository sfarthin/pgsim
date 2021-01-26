import { tuple1 } from "./tuple1";
import {
  number,
  Decoder,
  exact,
  constant,
  either,
  boolean,
  optional,
} from "decoders";
import { PGString, stringDecoder } from "./constant";
import { TypeName, typeNameDecoder } from "./typeName";

export enum RemoveType {
  SEQUENCE = 33,
  TABLE = 37,
  TYPE = 45,
}

export type DropStmtSequence = {
  objects: [[PGString]];
  removeType: RemoveType.SEQUENCE;
  behavior: number;
  comment?: string;
  missing_ok?: boolean;
};

export type DropStmtTable = {
  objects: [[PGString]];
  removeType: RemoveType.TABLE;
  behavior: number;
  comment?: string;
  missing_ok?: boolean;
};

export type DropStmtType = {
  objects: [{ TypeName: TypeName }];
  removeType: RemoveType.TYPE;
  behavior: number;
  comment?: string;
  missing_ok?: boolean;
};

export type DropStmt = DropStmtSequence | DropStmtType | DropStmtTable;

export const dropStmtDecoder: Decoder<DropStmt> = either(
  exact({
    objects: tuple1(tuple1(stringDecoder)),
    removeType: either(
      constant(RemoveType.SEQUENCE) as Decoder<RemoveType.SEQUENCE>,
      constant(RemoveType.TABLE) as Decoder<RemoveType.TABLE>
    ),
    behavior: number,
    missing_ok: optional(boolean),
  }),
  exact({
    objects: tuple1(exact({ TypeName: typeNameDecoder })),
    removeType: constant(RemoveType.TYPE) as Decoder<RemoveType.TYPE>,
    behavior: number,
    missing_ok: optional(boolean),
  })
);
