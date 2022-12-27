import { IndexElem } from "~/types";
import {
  sequence,
  transform,
  Rule,
  identifier,
  optional,
  __,
  combineComments,
  or,
  keyword,
} from "./util";

export const indexElem: Rule<{
  value: { IndexElem: IndexElem };
  codeComment: string;
}> = transform(
  sequence([
    identifier,
    __,
    optional(or([keyword("ASC"), keyword("DESC")])),
    __,
    optional(
      sequence([
        keyword("NULLS" as any),
        __,
        or([keyword("FIRST" as any), keyword("LAST" as any)]),
      ])
    ),
  ]),
  (v) => {
    return {
      value: {
        IndexElem: {
          name: v[0],
          ordering:
            v[2]?.value === "ASC"
              ? "SORTBY_ASC"
              : v[2]?.value === "DESC"
              ? "SORTBY_DESC"
              : "SORTBY_DEFAULT",
          nulls_ordering:
            v[4]?.[2].value === "FIRST"
              ? "SORTBY_NULLS_FIRST"
              : v[4]?.[2].value === "LAST"
              ? "SORTBY_NULLS_LAST"
              : "SORTBY_NULLS_DEFAULT",
        },
      },
      codeComment: combineComments(v[1], v[3], v[4]?.[1]),
    };
  }
);
