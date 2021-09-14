import { NullTest } from "../types";
import { rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

export default function rowExpr<T>(c: NullTest, f: Formatter<T>): T[] {
  const { symbol, _, keyword } = f;

  return [
    ...rawValue(c.arg, f).flat(),
    _,
    keyword("IS"),
    _,
    ...(c.nulltesttype === "IS_NOT_NULL" ? [keyword("NOT"), _] : []),
    keyword("NULL"),
  ];
}
