import { AlterSeqStmt } from "../types";
import defElem from "./defElem";
import { comment, keyword, _, identifier, symbol, indent, Block } from "./util";

export default function alterSeqStmt(c: AlterSeqStmt): Block {
  const name = c.sequence.relname;
  return [
    ...comment(c.codeComment),
    [keyword("ALTER"), _, keyword("SEQUENCE"), _, identifier(name)],
    ...(c.options
      ? indent(
          c.options.reduce(
            (acc, e, i) => [
              ...acc,
              ...comment(e.DefElem.codeComment),
              [
                ...defElem(e.DefElem),
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
