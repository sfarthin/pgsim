import {
  optional,
  array,
  string,
  exact,
  Decoder,
  number,
  boolean,
  unknown,
} from "decoders";
import { Constraint, constraintDecoder } from "./constraint";
import { TypeName, typeNameDecoder } from "./typeName";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { Location, locationDecoder } from "./location";
import dispatch from "./dispatch";

export type ColumnDef = {
  colname: string;
  typeName: { TypeName: TypeName };
  constraints?: Array<{ Constraint: Constraint }>;
  is_local: boolean;
  collClause?: unknown;
  location: Location;
  comment?: string;
};

export const columnDefDecoder: Decoder<ColumnDef> = exact({
  colname: string,
  typeName: exact({ TypeName: typeNameDecoder }),
  constraints: optional(array(exact({ Constraint: constraintDecoder }))),
  is_local: boolean,
  collClause: unknown,
  location: locationDecoder,
  comment: optional(string),
});

export type Relation = {
  RangeVar: RangeVar;
};

export const relationDecoder = exact({
  RangeVar: rangeVarDecoder,
});

export type CreateStmt = {
  relation: Relation;
  tableElts?: Array<{ ColumnDef?: ColumnDef } | { Constraint?: Constraint }>;
  oncommit: number;
  inhRelations?: unknown; // CREATE TEMP TABLE t2c (primary key (ab)) INHERITS (t2);
  options?: unknown;
  if_not_exists?: boolean;
  partspec?: unknown;
  partbound?: unknown;
  comment?: string;
};

export const createStmtDecoder: Decoder<CreateStmt> = exact({
  relation: relationDecoder,
  tableElts: optional(
    array(
      dispatch({
        ColumnDef: columnDefDecoder,
        Constraint: constraintDecoder,
      })
    )
  ),
  oncommit: number,
  inhRelations: unknown,
  options: unknown,
  if_not_exists: optional(boolean),
  partspec: unknown,
  partbound: unknown,
  comment: optional(string),
});
