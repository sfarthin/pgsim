import * as d from "decoders";
import { Alias, aliasDecoder } from "./alias";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";

export type RangeSubselect = {
  subquery: {
    SelectStmt: SelectStmt;
  };
  alias: {
    Alias: Alias;
  };
};

export const rangeSubselectDecoder: d.Decoder<RangeSubselect> = d.exact({
  subquery: d.exact({
    SelectStmt: (blob) => selectStmtDecoder(blob),
  }),
  alias: d.exact({
    Alias: aliasDecoder,
  }),
});
