import { AlterEnumStmt } from "../types";
import comment from "./comment";
import { Formatter } from "./util";

const beforeAndAfter = <T>(c: AlterEnumStmt, f: Formatter<T>): T[] => {
  const { keyword, _, literal } = f;
  if (!("oldVal" in c)) {
    if (!c.newValIsAfter && c.newValNeighbor) {
      return [_, keyword("BEFORE"), _, literal(`'${c.newValNeighbor}'`)];
    }

    if (c.newValNeighbor) {
      return [_, keyword("AFTER"), _, literal(`'${c.newValNeighbor}'`)];
    }
  }

  return [];
};

export default function alterEnumStmt<T>(
  c: AlterEnumStmt,
  f: Formatter<T>
): T[][] {
  const { keyword, _, identifier, literal, symbol } = f;
  if ("oldVal" in c) {
    return [
      ...comment(c.codeComment, f),
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
        literal(`'${c.oldVal}'`),
        _,
        keyword("TO"),
        _,
        literal(`'${c.newVal}'`),
        symbol(";"),
      ],
    ];
  }

  return [
    ...comment(c.codeComment, f),
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
      literal(`'${c.newVal}'`),
      ...beforeAndAfter(c, f),
      symbol(";"),
    ],
  ];
}
