import { AlterEnumStmt } from "../types";
import {
  keyword,
  _,
  identifier,
  stringLiteral,
  symbol,
  comment,
  Line,
  Block,
} from "./util";

const beforeAndAfter = (c: AlterEnumStmt): Line => {
  if (!("oldVal" in c)) {
    if (!c.newValIsAfter && c.newValNeighbor) {
      return [_, keyword("BEFORE"), _, stringLiteral(c.newValNeighbor)];
    }

    if (c.newValNeighbor) {
      return [_, keyword("AFTER"), _, stringLiteral(c.newValNeighbor)];
    }
  }

  return [];
};

export default function alterEnumStmt(c: AlterEnumStmt): Block {
  if ("oldVal" in c) {
    return [
      ...comment(c.codeComment),
      [
        keyword("ALTER"),
        _,
        keyword("TYPE"),
        _,
        identifier(c.typeName[0].String.str),
        _,
        keyword("RENAME"),
        _,
        keyword("VALUE"),
        _,
        stringLiteral(c.oldVal),
        _,
        keyword("TO"),
        _,
        stringLiteral(c.newVal),
        symbol(";"),
      ],
    ];
  }

  return [
    ...comment(c.codeComment),
    [
      keyword("ALTER"),
      _,
      keyword("TYPE"),
      _,
      identifier(c.typeName[0].String.str),
      _,
      keyword("ADD"),
      _,
      keyword("VALUE"),
      ...(c.skipIfNewValExists
        ? [_, keyword("IF"), _, keyword("NOT"), _, keyword("EXISTS")]
        : []),
      _,
      stringLiteral(c.newVal),
      ...beforeAndAfter(c),
      symbol(";"),
    ],
  ];
}
