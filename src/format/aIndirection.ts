import { AIndirection } from "src/types/aIndirection";
import { symbol, _, Block } from "./util";
import { rawValue } from "./rawExpr";

export default function aIndirection(c: AIndirection): Block {
  return [
    [
      ...rawValue(c.arg).flat(),
      symbol("["),
      ...c.indirection
        .map((r, i) => [
          ...rawValue(r.A_Indices.uidx).flat(),
          ...(i !== c.indirection.length - 1 ? [_, symbol(",")] : []),
        ])
        .flat(),
      symbol("]"),
    ],
  ];
}
