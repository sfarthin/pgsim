import { AlterDatabaseSetStmt } from "~/types";
import aConst from "./aConst";
import { comment, keyword, symbol, Block, _, identifier, Line } from "./util";

function body(c: AlterDatabaseSetStmt): Line {
  switch (c.setstmt.kind) {
    case "VAR_RESET":
      return [keyword("RESET"), _, identifier(c.setstmt.name)];
    case "VAR_RESET_ALL":
      return [keyword("RESET"), _, keyword("ALL")];
    case "VAR_SET_CURRENT":
      return [
        keyword("SET"),
        _,
        identifier(c.setstmt.name),
        _,
        keyword("FROM"),
        _,
        keyword("CURRENT"),
      ];
    case "VAR_SET_DEFAULT":
      return [
        keyword("SET"),
        _,
        identifier(c.setstmt.name),
        _,
        keyword("TO"),
        _,
        keyword("DEFAULT"),
      ];
    case "VAR_SET_VALUE":
      return [
        keyword("SET"),
        _,
        identifier(c.setstmt.name),
        _,
        keyword("TO"),
        _,
        ...aConst(c.setstmt.args[0].A_Const),
      ];
  }

  throw new Error("Unexpected");
}

export default function (c: AlterDatabaseSetStmt): Block {
  return [
    ...comment(c.codeComment),
    [
      keyword("ALTER"),
      _,
      keyword("DATABASE"),
      _,
      identifier(c.dbname),
      _,
      ...body(c),
      symbol(";"),
    ],
  ];
}
