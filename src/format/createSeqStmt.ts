import { CreateSeqStmt } from "~/types";
import defElem from "./defElem";
import { keyword, _, identifier, symbol, indent, comment, Block } from "./util";

export default function createSeqStmt(c: CreateSeqStmt): Block {
  const name = c.sequence.relname;

  return [
    ...comment(c.codeComment),
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
              ...comment(e.DefElem.codeComment),
              [
                ...defElem(e.DefElem),
                // If this is the last defElem, use semicolon
                ...(c.options && c.options.length - 1 === i
                  ? [symbol(";")]
                  : []),
              ],
            ],
            [] as Block
          )
        )
      : []),
  ];
}
