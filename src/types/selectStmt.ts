import {
  string,
  number,
  exact,
  Decoder,
  optional,
  guard,
  array,
  either3,
  unknown,
} from "decoders";
import { Location, locationDecoder } from "./location";
import { targetValueDecoder, TargetValue } from "./targetValue";

export type ResTarget = {
  name?: string;
  val: TargetValue;
  location: Location;
};

export const resTargetDecoder: Decoder<ResTarget> = exact({
  name: optional(string),
  val: targetValueDecoder,
  location: locationDecoder,
});

export const verifyResTarget = guard(resTargetDecoder);

export type SelectStmt =
  | {
      op: number;
      targetList: { ResTarget?: unknown }[];
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
    }
  | {
      op: number;
      valuesLists?: unknown;
      fromClause?: unknown;
      whereClause?: unknown;
      sortClause?: unknown;
    }

  // (SELECT * FROM distinct_hash_1 EXCEPT SELECT * FROM distinct_group_1) UNION ALL (SELECT * FROM distinct_group_1 EXCEPT SELECT * FROM distinct_hash_1);
  // https://doxygen.postgresql.org/parsenodes_8h.html#a29d933d0f4ff963ca56745a8da93526b
  | {
      op: number;
      larg?: unknown;
      rarg?: unknown;
      all?: unknown;
      sortClause?: unknown;
      lockingClause?: unknown;
      limitCount?: unknown;
    };

export const selectStmtDecoder: Decoder<SelectStmt> = either3(
  exact({
    targetList: array(exact({ ResTarget: unknown })),
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
  }),
  exact({
    valuesLists: unknown,
    fromClause: optional(array(unknown)),
    whereClause: unknown,
    sortClause: unknown,
    op: number,
  }),

  exact({
    op: number,
    larg: unknown,
    rarg: unknown,
    all: unknown,
    sortClause: unknown,
    lockingClause: unknown,
    limitCount: unknown,
  })
);

export const verifySelectStatement = guard(
  exact({ SelectStmt: selectStmtDecoder })
);
