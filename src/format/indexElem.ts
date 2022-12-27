import { IndexElem } from "~/types";
import { keyword, identifier, _, Line } from "./util";

export function indexElem(c: IndexElem): Line {
  return [
    identifier(c.name),

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
  ];
}
