import { AlterSeqStmt } from "../types";
import defElem from "./defElem";
import comment from "./comment";
import { Formatter } from "./util";

export default function alterSeqStmt<T>(
  c: AlterSeqStmt,
  f: Formatter<T>
): T[][] {
  const { keyword, _, identifier, symbol, indent } = f;
  const name = c.sequence.RangeVar.relname;
  return [
    ...comment(c.codeComment, f),
    [keyword("ALTER"), _, keyword("SEQUENCE"), _, identifier(name)],
    ...(c.options
      ? indent(
          c.options.reduce(
            (acc, e, i) => [
              ...acc,
              ...comment(e.DefElem.codeComment, f),
              [
                ...defElem(e.DefElem, f),
                ...(c.options && c.options.length - 1 === i
                  ? [symbol(";")]
                  : []),
              ],
            ],
            [] as T[][]
          )
        )
      : []),
  ];
}
