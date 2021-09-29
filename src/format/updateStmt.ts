import { UpdateStmt } from "../types";
import { Formatter } from "./util";
import comment from "./comment";
import rangeVar from "./rangeVar";
import { rawValue } from "./rawExpr";

export default function <T>(c: UpdateStmt, f: Formatter<T>): T[][] {
  const { symbol, identifier, keyword, indent, _ } = f;

  return [
    ...comment(c.codeComment, f),
    [keyword("UPDATE")],
    ...indent([rangeVar(c.relation, f)]),
    [keyword("SET")],
    ...indent(
      c.targetList.map((t, i) => {
        if (!t.ResTarget.name) {
          throw new Error(`ResTraget.name expected to be defined`);
        }

        return [
          identifier(t.ResTarget.name),
          _,
          symbol("="),
          _,
          ...rawValue(t.ResTarget.val, f).flat(),
          ...(i < c.targetList.length - 1 ? [symbol(",")] : [symbol(";")]),
        ];
      })
    ),
  ];
}
