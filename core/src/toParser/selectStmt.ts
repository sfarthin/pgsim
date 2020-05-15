import {
  guard,
  string,
  number,
  exact,
  Decoder,
  array,
  optional,
  mixed,
} from "decoders";
import { targetValueDecoder, TargetValue } from "./targetValue";

export type ResTarget = {
  name: string | void;
  val: TargetValue;
  location: number;
};

const resTargetDecoder: Decoder<ResTarget> = exact({
  name: optional(string),
  val: targetValueDecoder,
  location: number,
});

export type SelectStmt = {
  targetList: { ResTarget: unknown }[];
  fromClause: unknown[] | void;
  whereClause: unknown;
  op: number;
};

export const selectStmtDecoder: Decoder<SelectStmt> = exact({
  targetList: array(exact({ ResTarget: mixed })),
  fromClause: optional(array(mixed)),
  whereClause: optional(mixed),
  op: number,
});

export const verifySelectStatement = guard(
  exact({ SelectStmt: selectStmtDecoder })
);

export const verifyResTarget = guard(resTargetDecoder);
