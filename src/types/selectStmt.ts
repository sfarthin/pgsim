import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { rawExprDecoder, RawExpr } from "./rawExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ResTarget = {
  name?: string;
  val: RawExpr;
  location: Location;
};

export const resTargetDecoder: d.Decoder<ResTarget> = d.exact({
  name: d.optional(d.string),
  val: rawExprDecoder,
  location: locationDecoder,
});

export type SelectStmt = {
  op: number;
  targetList: {
    ResTarget?: ResTarget;
  }[];
  fromClause?: { RangeVar: RangeVar }[];
  whereClause?: RawExpr;
  groupClause?: unknown;
  withClause?: unknown;
  intoClause?: unknown; // SELECT * INTO TABLE onek2 FROM onek;
  limitOffset?: unknown;
  limitCount?: unknown;
  distinctClause?: unknown;
  havingClause?: unknown;
  lockingClause?: unknown; // SELECT ctid,cmin,* FROM combocidtest FOR UPDATE;
  sortClause?: unknown;
  codeComment?: string;
};
// | {
//     op: number;
//     valuesLists?: unknown;
//     fromClause?: unknown;
//     whereClause?: unknown;
//     sortClause?: unknown;
//   }

// // (SELECT * FROM distinct_hash_1 EXCEPT SELECT * FROM distinct_group_1) UNION ALL (SELECT * FROM distinct_group_1 EXCEPT SELECT * FROM distinct_hash_1);
// // https://doxygen.postgresql.org/parsenodes_8h.html#a29d933d0f4ff963ca56745a8da93526b
// | {
//     op: number;
//     larg?: unknown;
//     rarg?: unknown;
//     all?: unknown;
//     sortClause?: unknown;
//     lockingClause?: unknown;
//     limitCount?: unknown;
//   };

export const selectStmtDecoder: d.Decoder<SelectStmt> = d.exact({
  targetList: d.array(
    d.exact({
      ResTarget: resTargetDecoder,
    })
  ),
  fromClause: d.optional(d.array(d.exact({ RangeVar: rangeVarDecoder }))),
  whereClause: d.optional(rawExprDecoder),
  groupClause: d.unknown,
  intoClause: d.unknown,
  withClause: d.unknown,
  limitOffset: d.unknown,
  limitCount: d.unknown,
  havingClause: d.unknown,
  distinctClause: d.unknown,
  lockingClause: d.unknown,
  sortClause: d.unknown,
  op: d.number,
});
//   ,
//   exact({
//     valuesLists: unknown,
//     fromClause: optional(array(unknown)),
//     whereClause: unknown,
//     sortClause: unknown,
//     op: number,
//   }),

//   exact({
//     op: number,
//     larg: unknown,
//     rarg: unknown,
//     all: unknown,
//     sortClause: unknown,
//     lockingClause: unknown,
//     limitCount: unknown,
//   })
// );
