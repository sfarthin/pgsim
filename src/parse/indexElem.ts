import { IndexElem } from "~/types";
import { rawValue } from "./rawExpr";
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
  inParens,
} from "./util";

export const indexElem: Rule<{
  value: { IndexElem: IndexElem };
  codeComment: string;
}> = transform(
  sequence([
    or([identifier, inParens((blob) => rawValue(blob))]),
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
          ...(typeof v[0] === "string"
            ? { name: v[0] }
            : {
                expr: v[0].value.value,
              }),
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
      codeComment: combineComments(
        ...(typeof v[0] !== "string"
          ? [
              v[0].topCodeComment,
              v[0].value.codeComment,
              v[0].bottomCodeComment,
            ]
          : []),
        v[1],
        v[3],
        v[4]?.[1]
      ),
    };
  }
);
