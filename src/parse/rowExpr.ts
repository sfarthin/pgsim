import {
  Rule,
  sequence,
  __,
  LPAREN,
  RPAREN,
  zeroToMany,
  COMMA,
  transform,
  combineComments,
} from "./util";
import { RowExpr } from "../types/rowExpr";
import { rawValue } from "./rawExpr";

export const rowExpr: Rule<{
  value: { RowExpr: RowExpr };
  codeComment: string;
}> = transform(
  sequence([
    LPAREN,
    __,
    (ctx) => rawValue(ctx),
    zeroToMany(sequence([__, COMMA, __, (ctx) => rawValue(ctx)])),
    __,
    RPAREN,
  ]),
  (v) => {
    const args = v[3].map((i) => i[3].value);
    return {
      value: {
        RowExpr: {
          args: [v[2].value, ...args],
          row_format: "COERCE_IMPLICIT_CAST",
          location: v[0].start,
        },
      },
      codeComment: combineComments(
        v[1],
        v[2].codeComment,
        ...v[3].flatMap((k) => [k[0], k[2]]),
        v[4]
      ),
    };
  }
);
