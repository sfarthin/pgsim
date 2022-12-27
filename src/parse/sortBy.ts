import {
  __,
  ORDER,
  BY,
  sequence,
  optional,
  or,
  ASC,
  DESC,
  zeroToMany,
  COMMA,
  Rule,
  combineComments,
  transform,
} from "./util";
import { rawValue } from "./rawExpr";
import { SortBy, SortByDir } from "../types/sortBy";

export const sortBy: Rule<{ SortBy: SortBy }[]> = transform(
  sequence([
    ORDER,
    __,
    BY,
    __,
    (ctx) => rawValue(ctx), // 5
    __,
    optional(or([ASC, DESC])),
    zeroToMany(
      sequence([
        __,
        COMMA,
        __,
        (ctx) => rawValue(ctx),
        __,
        optional(or([ASC, DESC])), // 5
      ])
    ),
  ]),
  (v) => {
    const firstSort: SortBy = {
      codeComment: combineComments(v[1], v[3], v[4].codeComment, v[5]),
      location: -1,
      sortby_dir: v[6]
        ? v[6].value === "ASC"
          ? SortByDir.SORTBY_ASC
          : SortByDir.SORTBY_DESC
        : SortByDir.SORTBY_DEFAULT,
      sortby_nulls: "SORTBY_NULLS_DEFAULT",
      node: v[4].value,
    };

    const restOfSorts: { SortBy: SortBy }[] = v[7].map((s) => ({
      SortBy: {
        codeComment: combineComments(s[0], s[2], s[3].codeComment, s[4]),
        location: -1,
        sortby_dir: s[5]
          ? s[5].value === "ASC"
            ? SortByDir.SORTBY_ASC
            : SortByDir.SORTBY_DESC
          : SortByDir.SORTBY_DEFAULT,
        sortby_nulls: "SORTBY_NULLS_DEFAULT",
        node: s[3].value,
      },
    }));

    return [{ SortBy: firstSort }, ...restOfSorts];
  }
);
