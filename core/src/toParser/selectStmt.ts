import {
  string,
  number,
  exact,
  Decoder,
  optional,
  guard,
  mixed,
  array,
  either,
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
      targetList: { ResTarget: unknown }[];
      fromClause: unknown[] | void;
      whereClause: unknown;
      withClause?: unknown;
      limitOffset?: unknown;
      distinctClause?: unknown;
      sortClause: unknown;
      op: number;
    }
  | {
      valuesLists: unknown;
      fromClause: unknown[] | void;
      whereClause: unknown;
      sortClause: unknown;
      op: number;
    };

export const selectStmtDecoder: Decoder<SelectStmt> = either(
  exact({
    targetList: array(exact({ ResTarget: mixed })),
    fromClause: optional(array(mixed)),
    whereClause: optional(mixed),
    withClause: mixed,
    limitOffset: mixed,
    distinctClause: optional(mixed),
    sortClause: mixed,
    op: number,
  }),
  exact({
    valuesLists: mixed,
    fromClause: optional(array(mixed)),
    whereClause: optional(mixed),
    sortClause: mixed,
    op: number,
  })
);

export const verifySelectStatement = guard(
  exact({ SelectStmt: selectStmtDecoder })
);
