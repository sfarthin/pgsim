import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { RangeSubselect, rangeSubselectDecoder } from "./RangeSubselect";

// https://doxygen.postgresql.org/nodes_8h.html#aef400c43b34e3ecc3f7b342aa821395d
export enum JoinType {
  /*
   * The canonical kinds of joins according to the SQL JOIN syntax. Only
   * these codes can appear in parser output (e.g., JoinExpr nodes).
   */
  JOIN_INNER = 0 /* matching tuple pairs only */,
  JOIN_LEFT = 1 /* pairs + unmatched LHS tuples */,
  JOIN_FULL = 2 /* pairs + unmatched LHS + unmatched RHS */,
  JOIN_RIGHT = 3 /* pairs + unmatched RHS tuples */,
}

export type JoinExpr = {
  jointype: JoinType;
  larg: { RangeVar: RangeVar } | { RangeSubselect: RangeSubselect };
  rarg: { RangeVar: RangeVar } | { RangeSubselect: RangeSubselect };
  quals: RawValue;
  // isNatural?: unknown;
  // usingClause?: unknown;
  // alias?: unknown;
};

export const joinExprDecoder: d.Decoder<JoinExpr> = d.exact({
  jointype: d.oneOf(Object.values(JoinType)) as d.Decoder<JoinType>,
  larg: d.either(
    d.exact({ RangeVar: rangeVarDecoder }),
    d.exact({ RangeSubselect: rangeSubselectDecoder })
  ),
  rarg: d.either(
    d.exact({ RangeVar: rangeVarDecoder }),
    d.exact({ RangeSubselect: rangeSubselectDecoder })
  ),
  quals: (blob) => rawValueDecoder(blob),
  // isNatural: unknown,
  // usingClause: unknown,
  // alias: unknown,
});
