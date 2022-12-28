import * as d from "decoders";
import { Constraint, constraintDecoder } from "./constraint";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import dispatch from "./dispatch";
import { columnDefDecoder, ColumnDef } from "./columnDef";

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
        ColumnDef: (blob) => columnDefDecoder(blob),
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
