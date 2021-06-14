import { AIndirection } from "src/types/aIndirection";
import { Formatter, join } from "./util";
import { rawValue } from "./rawExpr";

export default function aIndirection<T>(
  c: AIndirection,
  f: Formatter<T>
): T[][] {
  const { symbol, identifier, _ } = f;
  return [
    [
      ...rawValue(c.arg, f).flat(),
      symbol("["),
      ...c.indirection
        .map((r, i) => [
          ...rawValue(r.A_Indices.uidx, f).flat(),
          ...(i !== c.indirection.length - 1 ? [_, symbol(",")] : []),
        ])
        .flat(),
      symbol("]"),
    ],
  ];
}
