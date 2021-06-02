import { Formatter } from "./util";
import { SortBy, SortByDir } from "../types/sortBy";
import { rawValue } from "./rawExpr";
import comment from "./comment";

export default function <T>(c: { SortBy: SortBy }[], f: Formatter<T>): T[][] {
  const { keyword, _, symbol, indent } = f;

  return [
    [keyword("ORDER"), _, keyword("BY")],
    ...indent(
      c.flatMap((s, i) => {
        return [
          ...comment(s.SortBy.codeComment, f),
          [
            ...rawValue(s.SortBy.node, f).flat(),
            ...(s.SortBy.sortby_dir === SortByDir.SORTBY_ASC
              ? [_, keyword("ASC")]
              : s.SortBy.sortby_dir === SortByDir.SORTBY_DESC
              ? [_, keyword("DESC")]
              : []),
            ...(c.length - 1 === i ? [] : [symbol(",")]),
          ],
        ];
      })
    ),
  ];
}
