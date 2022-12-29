import * as d from "decoders";
import { constraintDecoder } from "./constraint";
import { typeNameDecoder } from "./typeName";
import { locationDecoder } from "./location";
import { rawValueDecoder } from "./rawExpr";

export const columnDefDecoder = d.exact({
  colname: d.optional(d.string),
  typeName: typeNameDecoder,
  constraints: d.optional(d.array(d.exact({ Constraint: constraintDecoder }))),
  is_local: d.optional(d.boolean),
  collClause: d.optional(d.unknown),
  location: locationDecoder,
  codeComment: d.optional(d.string),
  raw_default: d.optional((blob) => rawValueDecoder(blob)),
});
export type ColumnDef = d.DecoderType<typeof columnDefDecoder>;
