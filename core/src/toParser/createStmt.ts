import {
  guard,
  optional,
  array,
  string,
  exact,
  Decoder,
  number,
  boolean,
  mixed,
} from "decoders";
import { Constraint, constraintDecoder } from "./constraint";
import { TypeName, typeNameDecoder } from "./typeCast";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ColumnDef = {
  colname: string;
  typeName: { TypeName: TypeName };
  constraints: Array<{ Constraint: Constraint }> | void;
  is_local: boolean;
  location: number;
};

export const columnDefDecoder: Decoder<ColumnDef> = exact({
  colname: string,
  typeName: exact({ TypeName: typeNameDecoder }),
  constraints: optional(array(exact({ Constraint: constraintDecoder }))),
  is_local: boolean,
  location: number,
});

export const verifyColumnDef = guard(columnDefDecoder);

export type Relation = {
  RangeVar: RangeVar;
};

export const relationDecoder = exact({
  RangeVar: rangeVarDecoder,
});

export type CreateStmt = {
  relation: Relation;
  tableElts: Array<{ ColumnDef: unknown }>;
  oncommit: number;
};

export const createStmtDecoder = exact({
  relation: relationDecoder,
  tableElts: array(exact({ ColumnDef: mixed })),
  oncommit: number,
});
