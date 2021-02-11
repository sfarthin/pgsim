import {
  string,
  number,
  exact,
  Decoder,
  optional,
  guard,
  array,
  unknown,
} from "decoders";
import { Location, locationDecoder } from "./location";
import { rawExprDecoder, RawExpr } from "./rawExpr";

export type ResTarget = {
  name?: string;
  val: RawExpr;
  location: Location;
};

export const resTargetDecoder: Decoder<ResTarget> = exact({
  name: optional(string),
  val: rawExprDecoder,
  location: locationDecoder,
});

export const verifyResTarget = guard(resTargetDecoder);

export type SelectStmt = {
  op: number;
  targetList: {
    ResTarget?: ResTarget;
  }[];
  fromClause?: unknown;
  whereClause?: unknown;
  groupClause?: unknown;
  withClause?: unknown;
  intoClause?: unknown; // SELECT * INTO TABLE onek2 FROM onek;
  limitOffset?: unknown;
  limitCount?: unknown;
  distinctClause?: unknown;
  havingClause?: unknown;
  lockingClause?: unknown; // SELECT ctid,cmin,* FROM combocidtest FOR UPDATE;
  sortClause?: unknown;
  comment?: string;
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

export const selectStmtDecoder: Decoder<SelectStmt> = exact({
  targetList: array(
    exact({
      ResTarget: resTargetDecoder,
    })
  ),
  fromClause: optional(array(unknown)),
  whereClause: unknown,
  groupClause: unknown,
  intoClause: unknown,
  withClause: unknown,
  limitOffset: unknown,
  limitCount: unknown,
  havingClause: unknown,
  distinctClause: unknown,
  lockingClause: unknown,
  sortClause: unknown,
  op: number,
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

export const verifySelectStatement = guard(
  exact({ SelectStmt: selectStmtDecoder })
);
