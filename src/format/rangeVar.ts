import { RangeVar } from "../types";
import { identifier, symbol, keyword, _, Line } from "./util";

export default function rangeVar(c: RangeVar): Line {
  return [
    ...(c.schemaname
      ? [identifier(c.schemaname), symbol("."), identifier(c.relname)]
      : [identifier(c.relname)]),
    ...(c.alias ? [_, keyword("AS"), _, identifier(c.alias.aliasname)] : []),
  ];
}
