import { SubLink, SubLinkType } from "../types";
import { Block, keyword, _, symbol, indent } from "./util";
import { innerSelect } from "./selectStmt";
import { rawValue } from "./rawExpr";

export default function (c: SubLink): Block {
  switch (c.subLinkType) {
    case SubLinkType.EXISTS_SUBLINK:
      return [
        [keyword("EXISTS"), _, symbol("(")],
        ...indent(innerSelect(c.subselect.SelectStmt)),
        [symbol(")")],
      ];
    case SubLinkType.ANY_SUBLINK:
      return [
        [...rawValue(c.testexpr).flat(), _, keyword("IN"), _, symbol("(")],
        ...indent(innerSelect(c.subselect.SelectStmt)),
        [symbol(")")],
      ];
    case SubLinkType.EXPR_SUBLINK:
      return [
        [symbol("(")],
        ...indent(innerSelect(c.subselect.SelectStmt)),
        [symbol(")")],
      ];
    default:
      throw new Error(`Cannot handle Sublink`);
  }
}
