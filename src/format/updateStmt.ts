import { UpdateStmt } from "~/types";
import { symbol, identifier, keyword, indent, _, comment, Block } from "./util";

import rangeVar from "./rangeVar";
import { rawValue } from "./rawExpr";

export default function (c: UpdateStmt): Block {
  return [
    ...comment(c.codeComment),
    [keyword("UPDATE")],
    ...indent([rangeVar(c.relation)]),
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
          ...rawValue(t.ResTarget.val).flat(),
          ...(i < c.targetList.length - 1 ? [symbol(",")] : [symbol(";")]),
        ];
      })
    ),
  ];
}
