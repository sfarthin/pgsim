import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { Location, locationDecoder } from "./location";

// enum RenameType {
//   Column = 6,
// }

export type RenameStmt = {
  renameType: number;
  relationType: number;
  relation: {
    RangeVar: RangeVar;
  };
  subname: string;
  newname: string;
  behavior: 0;
  codeComment?: string;
};

export const renameStmtDecoder: d.Decoder<RenameStmt> = d.exact({
  renameType: d.number,
  relationType: d.number,
  relation: d.exact({
    RangeVar: rangeVarDecoder,
  }),
  subname: d.string,
  newname: d.string,
  behavior: d.constant(0),
  codeComment: d.optional(d.string),
});
