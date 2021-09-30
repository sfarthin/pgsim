import * as d from "decoders";
import { Constraint, constraintDecoder } from "./constraint";
import { TypeName, typeNameDecoder } from "./typeName";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { locationDecoder } from "./location";
import dispatch from "./dispatch";

export const columnDefDecoder = d.exact({
  colname: d.optional(d.string),
  typeName: typeNameDecoder,
  constraints: d.optional(d.array(d.exact({ Constraint: constraintDecoder }))),
  is_local: d.optional(d.boolean),
  collClause: d.optional(d.unknown),
  location: locationDecoder,
  codeComment: d.optional(d.string),
});
export type ColumnDef = d.DecoderType<typeof columnDefDecoder>;

export type CreateStmt = {
  relation: RangeVar;
  tableElts?: Array<{ ColumnDef: ColumnDef } | { Constraint: Constraint }>;
  oncommit: "ONCOMMIT_NOOP";
  inhRelations?: unknown; // CREATE TEMP TABLE t2c (primary key (ab)) INHERITS (t2);
  options?: unknown;
  if_not_exists?: boolean;
  partspec?: unknown;
  partbound?: unknown;
  codeComment?: string;
};

export const createStmtDecoder: d.Decoder<CreateStmt> = d.exact({
  relation: rangeVarDecoder,
  tableElts: d.optional(
    d.array(
      dispatch({
        ColumnDef: columnDefDecoder,
        Constraint: constraintDecoder,
      })
    )
  ),
  oncommit: d.constant("ONCOMMIT_NOOP"),
  inhRelations: d.unknown,
  options: d.unknown,
  if_not_exists: d.optional(d.boolean),
  partspec: d.unknown,
  partbound: d.unknown,
  codeComment: d.optional(d.string),
});
