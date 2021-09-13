import {
  guard,
  exact,
  Decoder,
  either4,
  optional,
  boolean,
  unknown,
} from "decoders";
import { JoinExpr, joinExprDecoder } from "./joinExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { RangeSubselect, rangeSubselectDecoder } from "./RangeSubselect";

export type FromClause =
  | { RangeVar: RangeVar }
  | { JoinExpr: JoinExpr }
  | { RangeSubselect: RangeSubselect }
  | { RangeFunction?: unknown };

export const fromClauseDecoder: Decoder<FromClause> = either4(
  exact({ JoinExpr: joinExprDecoder }),
  exact({ RangeVar: rangeVarDecoder }),
  exact({ RangeSubselect: rangeSubselectDecoder }), // nested queries
  exact({ RangeFunction: unknown }) // select * from generate_series(-5, 5) t(i)
);

export const verifyFromClause = guard(fromClauseDecoder);
