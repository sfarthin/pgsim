import {
  guard,
  string,
  number,
  exact,
  Decoder,
  mixed,
  either3,
} from "decoders";
import { JoinExpr, joinExprDecoder } from "./joinExpr";

export type RangeVar = {
  relname: string;
  inhOpt: number;
  relpersistence: string;
  location: number;
};

export const rangeVarDecoder: Decoder<RangeVar> = exact({
  relname: string,
  inhOpt: number,
  relpersistence: string,
  location: number,
});

export type RangeSubselect = {
  subquery: unknown; // <--- Need to decode it at runtime,
  alias: { Alias: { aliasname: string } }; // <-- Must have an alias when in from
};

export const rangeSubselectDecoder = exact({
  subquery: mixed,
  alias: exact({ Alias: exact({ aliasname: string }) }),
});

export type FromClause =
  | { RangeVar: RangeVar }
  | { JoinExpr: JoinExpr }
  | { RangeSubselect: RangeSubselect };

export const fromClauseDecoder: Decoder<FromClause> = either3(
  exact({ JoinExpr: joinExprDecoder }),
  exact({ RangeVar: rangeVarDecoder }),
  exact({ RangeSubselect: rangeSubselectDecoder }) // nested queries
);

export const verifyFromClause = guard(fromClauseDecoder);
