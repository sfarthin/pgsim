import * as d from "decoders";
import { JoinExpr, joinExprDecoder } from "./joinExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { RangeSubselect, rangeSubselectDecoder } from "./RangeSubselect";

export type FromClause =
  | { RangeVar: RangeVar }
  | { JoinExpr: JoinExpr }
  | { RangeSubselect: RangeSubselect };
// | { RangeFunction?: unknown };

export const fromClauseDecoder: d.Decoder<FromClause> = d.either3(
  d.exact({ JoinExpr: joinExprDecoder }),
  d.exact({ RangeVar: rangeVarDecoder }),
  d.exact({ RangeSubselect: rangeSubselectDecoder }) // nested queries
  // d.exact({ RangeFunction: d.unknown }) // select * from generate_series(-5, 5) t(i)
);
