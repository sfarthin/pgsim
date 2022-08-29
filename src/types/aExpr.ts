import * as d from "decoders";
import {
  stringDecoder,
  String,
  A_Const_String,
  aConstStringDecoder,
} from "./constant";
import { Location, locationDecoder } from "./location";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { List, listDecoder } from "./list";

// https://doxygen.postgresql.org/parsenodes_8h.html#a41cee9367d9d92ec6b4ee0bbc0df09fd
// AEXPR_OP,                   /* normal operator */
// AEXPR_OP_ANY,               /* scalar op ANY (array) */
// AEXPR_OP_ALL,               /* scalar op ALL (array) */
// AEXPR_DISTINCT,             /* IS DISTINCT FROM - name must be "=" */
// AEXPR_NOT_DISTINCT,         /* IS NOT DISTINCT FROM - name must be "=" */
// AEXPR_NULLIF,               /* NULLIF - name must be "=" */
// AEXPR_IN,                   /* [NOT] IN - name must be "=" or "<>" */
// AEXPR_LIKE,                 /* [NOT] LIKE - name must be "~~" or "!~~" */
// AEXPR_ILIKE,                /* [NOT] ILIKE - name must be "~~*" or "!~~*" */
// AEXPR_SIMILAR,              /* [NOT] SIMILAR - name must be "~" or "!~" */
// AEXPR_BETWEEN,              /* name must be "BETWEEN" */
// AEXPR_NOT_BETWEEN,          /* name must be "NOT BETWEEN" */
// AEXPR_BETWEEN_SYM,          /* name must be "BETWEEN SYMMETRIC" */
// AEXPR_NOT_BETWEEN_SYM       /* name must be "NOT BETWEEN SYMMETRIC" */
export enum AExprKind {
  AEXPR_OP = "AEXPR_OP", // normal operator
  AEXPR_IN = "AEXPR_IN", // IN - name must be "=" or "<>"
  AEXPR_LIKE = "AEXPR_LIKE",
}

export type AExpr =
  | {
      kind: AExprKind.AEXPR_OP;
      name: { String: String }[];
      lexpr?: RawValue;
      rexpr?: RawValue;
      location: Location;
    }
  | {
      kind: AExprKind.AEXPR_IN;
      name: { String: String }[];
      lexpr: RawValue;
      rexpr: { List: List<RawValue> };
      location: Location;
    }
  | {
      kind: AExprKind.AEXPR_LIKE;
      name: [{ String: String }];
      lexpr: RawValue;
      rexpr: { A_Const: A_Const_String };
      location: Location;
    };

export const aExprDecoder: d.Decoder<AExpr> = d.dispatch("kind", {
  [AExprKind.AEXPR_OP]: d.exact({
    kind: d.constant(AExprKind.AEXPR_OP),
    name: d.array(stringDecoder),
    lexpr: d.optional((blob) => rawValueDecoder(blob)),
    rexpr: d.optional((blob) => rawValueDecoder(blob)),
    location: locationDecoder,
  }),
  [AExprKind.AEXPR_IN]: d.exact({
    kind: d.constant(AExprKind.AEXPR_IN),
    name: d.array(stringDecoder),
    lexpr: (blob) => rawValueDecoder(blob),
    rexpr: d.exact({ List: listDecoder((blob) => rawValueDecoder(blob)) }),
    location: locationDecoder,
  }),
  [AExprKind.AEXPR_LIKE]: d.exact({
    kind: d.constant(AExprKind.AEXPR_LIKE),
    name: d.tuple1(stringDecoder),
    lexpr: (blob) => rawValueDecoder(blob),
    rexpr: d.exact({ A_Const: aConstStringDecoder }),
    location: locationDecoder,
  }),
});
