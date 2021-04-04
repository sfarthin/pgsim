import { SubLink, SubLinkType } from "../types";
import { Formatter } from "./util";
import { innerSelect } from "./selectStmt";
import { rawValue } from "./rawExpr";

export default function <T>(c: SubLink, f: Formatter<T>): T[][] {
  const { keyword, _, symbol, indent } = f;

  switch (c.subLinkType) {
    case SubLinkType.EXISTS_SUBLINK:
      return [
        [keyword("EXISTS"), _, symbol("(")],
        ...indent(innerSelect(c.subselect.SelectStmt, f)),
        [symbol(")")],
      ];
    case SubLinkType.ANY_SUBLINK:
      return [
        [...rawValue(c.testexpr, f), _, keyword("IN"), _, symbol("(")],
        ...indent(innerSelect(c.subselect.SelectStmt, f)),
        [symbol(")")],
      ];
    default:
      throw new Error(`Cannot handle Sublink`);
  }
}
