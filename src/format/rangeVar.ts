import { RangeVar } from "../types";
import { Formatter } from "./util";
import identifier from "./identifier";

export default function rangeVar<T>(c: RangeVar, f: Formatter<T>): T[] {
  const { keyword, _, symbol } = f;

  return [
    ...(c.schemaname
      ? [identifier(c.schemaname, f), symbol("."), identifier(c.relname, f)]
      : [identifier(c.relname, f)]),
    ...(c.alias
      ? [_, keyword("AS"), _, identifier(c.alias.Alias.aliasname, f)]
      : []),
  ];
}
