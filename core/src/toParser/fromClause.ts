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
import { aliasDecoder, Alias } from "./alias";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type RangeSubselect = {
  subquery?: unknown; // <--- Need to decode it at runtime,
  alias: { Alias: Alias }; // <-- Must have an alias when in from
  lateral?: boolean; // see gist.sql
};

export const rangeSubselectDecoder: Decoder<RangeSubselect> = exact({
  subquery: unknown,
  alias: exact({ Alias: aliasDecoder }),
  lateral: optional(boolean),
});

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
