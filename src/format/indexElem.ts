import { IndexElem } from "~/types";
import { rawValue } from "./rawExpr";
import {
  keyword,
  identifier,
  _,
  Block,
  toSingleLineIfPossible,
  symbol,
} from "./util";

export function indexElem(c: IndexElem): Block {
  return toSingleLineIfPossible([
    ...("name" in c
      ? [[identifier(c.name)]]
      : [[symbol("(")], ...rawValue(c.expr), [symbol(")")]]),

    [
      ...(c.ordering === "SORTBY_ASC"
        ? [_, keyword("ASC")]
        : c.ordering === "SORTBY_DESC"
        ? [_, keyword("DESC")]
        : []),

      ...(c.nulls_ordering === "SORTBY_NULLS_FIRST"
        ? [_, keyword("NULLS"), _, keyword("FIRST")]
        : c.nulls_ordering === "SORTBY_NULLS_LAST"
        ? [_, keyword("NULLS"), _, keyword("LAST")]
        : []),
    ],
  ]);
}
