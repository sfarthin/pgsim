import { keyword, _, symbol, indent, comment, Block } from "./util";
import { SortBy, SortByDir } from "../types/sortBy";
import { rawValue } from "./rawExpr";

export default function (c: { SortBy: SortBy }[]): Block {
  return [
    [keyword("ORDER"), _, keyword("BY")],
    ...indent(
      c.flatMap((s, i) => {
        return [
          ...comment(s.SortBy.codeComment),
          [
            ...rawValue(s.SortBy.node).flat(),
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
