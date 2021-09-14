import { CreateSeqStmt } from "../types";
import comment from "./comment";
import defElem from "./defElem";
import { Formatter } from "./util";

export default function createSeqStmt<T>(
  c: CreateSeqStmt,
  f: Formatter<T>
): T[][] {
  const { keyword, _, identifier, symbol, indent } = f;
  const name = c.sequence.relname;

  return [
    ...comment(c.codeComment, f),
    [
      keyword("CREATE"),
      _,
      keyword("SEQUENCE"),
      _,
      ...(c.if_not_exists
        ? [keyword("IF"), _, keyword("NOT"), _, keyword("EXISTS"), _]
        : []),
      identifier(name),

      // Add the semicolon here if there is no options
      ...(!c.options?.length ? [symbol(";")] : []),
    ],

    // If there are deElems, we have each on its own line.
    ...(c.options && c.options.length > 0
      ? indent(
          c.options.reduce(
            (acc, e, i) => [
              ...acc,
              ...comment(e.DefElem.codeComment, f),
              [
                ...defElem(e.DefElem, f),
                // If this is the last defElem, use semicolon
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
