import {
  guard,
  optional,
  array,
  string,
  exact,
  either,
  Decoder,
  number,
  boolean,
  unknown,
} from "decoders";
import { Constraint, constraintDecoder } from "./constraint";
import { TypeName, typeNameDecoder } from "./typeCast";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ColumnDef = {
  colname: string;
  typeName: { TypeName: TypeName };
  constraints?: Array<{ Constraint: Constraint }>;
  is_local: boolean;
  collClause?: unknown;
  location: number;
};

export const columnDefDecoder: Decoder<ColumnDef> = exact({
  colname: string,
  typeName: exact({ TypeName: typeNameDecoder }),
  constraints: optional(array(exact({ Constraint: constraintDecoder }))),
  is_local: boolean,
  collClause: unknown,
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
  tableElts?: Array<{ ColumnDef?: unknown } | { Constraint?: unknown }>;
  oncommit: number;
  inhRelations?: unknown; // CREATE TEMP TABLE t2c (primary key (ab)) INHERITS (t2);
  options?: unknown;
  if_not_exists?: boolean;
  partspec?: unknown;
  partbound?: unknown;
};

export const createStmtDecoder: Decoder<CreateStmt> = exact({
  relation: relationDecoder,
  tableElts: optional(
    array(either(exact({ ColumnDef: unknown }), exact({ Constraint: unknown })))
  ),
  oncommit: number,
  inhRelations: unknown,
  options: unknown,
  if_not_exists: optional(boolean),
  partspec: unknown,
  partbound: unknown,
});
