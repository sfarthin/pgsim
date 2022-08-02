import { NullTest } from "~/types";
import { rawValue } from "./rawExpr";
import { _, keyword, Line } from "./util";

export default function rowExpr(c: NullTest): Line {
  return [
    ...rawValue(c.arg).flat(),
    _,
    keyword("IS"),
    _,
    ...(c.nulltesttype === "IS_NOT_NULL" ? [keyword("NOT"), _] : []),
    keyword("NULL"),
  ];
}
