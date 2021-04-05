import { RangeVar } from "../types";
import { Formatter } from "./util";

export default function rangeVar<T>(c: RangeVar, f: Formatter<T>): T[] {
  const { keyword, _, identifier } = f;

  return [
    identifier(c.relname),
    ...(c.alias
      ? [_, keyword("AS"), _, identifier(c.alias.Alias.aliasname)]
      : []),
  ];
}
