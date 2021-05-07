import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { rawConditionDecoder, RawCondition } from "./rawExpr";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { SortBy, sortByDecoder } from "./sortBy";
import { JoinExpr, joinExprDecoder } from "./joinExpr";

export type ResTarget = {
  name?: string;
  val: RawCondition;
  location: Location;
};

export const resTargetDecoder: d.Decoder<ResTarget> = d.exact({
  name: d.optional(d.string),
  val: (blob) => rawConditionDecoder(blob),
  location: locationDecoder,
});

export type SelectStmt = {
  op: number;
  targetList: {
    ResTarget?: ResTarget;
  }[];
  fromClause?: ({ RangeVar: RangeVar } | { JoinExpr: JoinExpr })[];
  whereClause?: RawCondition;
  groupClause?: unknown;
  withClause?: unknown;
  intoClause?: unknown; // SELECT * INTO TABLE onek2 FROM onek;
  limitOffset?: unknown;
  limitCount?: unknown;
  distinctClause?: unknown;
  havingClause?: unknown;
  lockingClause?: unknown; // SELECT ctid,cmin,* FROM combocidtest FOR UPDATE;
  sortClause?: {
    SortBy: SortBy;
  }[];
  codeComment?: string;
  codeComments?: {
    targetList?: string[];
    fromClause?: string[];
    whereClause?: string[];
  };
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
      codeComment: d.optional(d.string),
    })
  ),
  fromClause: d.optional(
    d.array(
      d.either(
        d.exact({
          RangeVar: rangeVarDecoder,
          codeComment: d.optional(d.string),
        }),
        d.exact({
          JoinExpr: joinExprDecoder,
          codeComment: d.optional(d.string),
        })
      )
    )
  ),
  whereClause: d.optional((blob) => rawConditionDecoder(blob)),
  groupClause: d.unknown,
  intoClause: d.unknown,
  withClause: d.unknown,
  limitOffset: d.unknown,
  limitCount: d.unknown,
  havingClause: d.unknown,
  distinctClause: d.unknown,
  lockingClause: d.unknown,
  sortClause: d.optional(d.array(d.exact({ SortBy: sortByDecoder }))),
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
