import { tuple1 } from "./tuple1";
import { number, Decoder, exact } from "decoders";
import { PGString, stringDecoder } from "./constant";

export type DropStmt = {
  objects: [[PGString]];
  removeType: number;
  behavior: number;
};

export const dropStmtDecoder: Decoder<DropStmt> = exact({
  objects: tuple1(tuple1(stringDecoder)),
  removeType: number,
  behavior: number,
});
