import {
  Rule,
  sequence,
  __,
  LPAREN,
  RPAREN,
  zeroToMany,
  COMMA,
  transform,
} from "./util";
import { RowExpr } from "../types/rowExpr";
import { rawValue } from "./rawExpr";

export const rowExpr: Rule<{
  value: RowExpr;
  codeComment: string;
}> = transform(
  sequence([
    LPAREN,
    __,
    (ctx) => rawValue(ctx),
    __,
    zeroToMany(sequence([COMMA, __, (ctx) => rawValue(ctx)])),
    __,
    RPAREN,
  ]),
  (v) => {
    const args = v[4].map((i) => i[2].value);
    return {
      value: {
        args: [v[2].value, ...args],
        row_format: 2,
        location: v[0].start,
      },
      codeComment: "",
    };
  }
);
