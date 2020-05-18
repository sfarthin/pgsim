import {
  string,
  number,
  exact,
  Decoder,
  optional,
  guard,
  mixed,
  array,
  either3,
} from "decoders";
import { targetValueDecoder, TargetValue } from "./targetValue";

export type ResTarget = {
  name: string | void;
  val: TargetValue;
  location: number;
};

export const resTargetDecoder: Decoder<ResTarget> = exact({
  name: optional(string),
  val: targetValueDecoder,
  location: number,
});

export const verifyResTarget = guard(resTargetDecoder);

export type SelectStmt =
  | {
      op: number;
      targetList: { ResTarget: unknown }[];
      fromClause: unknown[] | void;
      whereClause: unknown;
      groupClause?: unknown;
      withClause?: unknown;
      intoClause?: unknown; // SELECT * INTO TABLE onek2 FROM onek;
      limitOffset?: unknown;
      limitCount?: unknown;
      distinctClause?: unknown;
      havingClause?: unknown;
      lockingClause?: unknown; // SELECT ctid,cmin,* FROM combocidtest FOR UPDATE;
      sortClause: unknown;
    }
  | {
      op: number;
      valuesLists: unknown;
      fromClause: unknown[] | void;
      whereClause: unknown;
      sortClause: unknown;
    }

  // (SELECT * FROM distinct_hash_1 EXCEPT SELECT * FROM distinct_group_1) UNION ALL (SELECT * FROM distinct_group_1 EXCEPT SELECT * FROM distinct_hash_1);
  // https://doxygen.postgresql.org/parsenodes_8h.html#a29d933d0f4ff963ca56745a8da93526b
  | {
      op: number;
      larg: unknown;
      rarg: unknown;
      all: unknown;
      sortClause?: unknown;
      lockingClause?: unknown;
      limitCount?: unknown;
    };

export const selectStmtDecoder: Decoder<SelectStmt> = either3(
  exact({
    targetList: array(exact({ ResTarget: mixed })),
    fromClause: optional(array(mixed)),
    whereClause: optional(mixed),
    groupClause: optional(mixed),
    intoClause: optional(mixed),
    withClause: optional(mixed),
    limitOffset: optional(mixed),
    limitCount: optional(mixed),
    havingClause: optional(mixed),
    distinctClause: optional(mixed),
    lockingClause: optional(mixed),
    sortClause: mixed,
    op: number,
  }),
  exact({
    valuesLists: mixed,
    fromClause: optional(array(mixed)),
    whereClause: optional(mixed),
    sortClause: mixed,
    op: number,
  }),

  exact({
    op: number,
    larg: mixed,
    rarg: mixed,
    all: mixed,
    sortClause: optional(mixed),
    lockingClause: optional(mixed),
    limitCount: optional(mixed),
  })
);

export const verifySelectStatement = guard(
  exact({ SelectStmt: selectStmtDecoder })
);
