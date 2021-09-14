import { DropStmt, RemoveType } from "../types";
import comment from "./comment";
import { Formatter } from "./util";

export default function <T>(c: DropStmt, f: Formatter<T>): T[][] {
  const { _, symbol, identifier, keyword } = f;
  if (c.removeType === RemoveType.TYPE) {
    return [
      ...comment(c.codeComment, f),
      [
        keyword("DROP"),
        _,
        keyword("TYPE"),
        _,
        ...(c.missing_ok ? [keyword("IF"), _, keyword("EXISTS"), _] : []),
        identifier(c.objects[0].TypeName.names[0].String.str),
        ...(c.behavior === 1 ? [_, keyword("CASCADE")] : []),
        symbol(";"),
      ],
    ];
  }

  if (
    c.removeType === RemoveType.TABLE ||
    c.removeType === RemoveType.SEQUENCE ||
    c.removeType === RemoveType.VIEW
  ) {
    return [
      ...comment(c.codeComment, f),
      [
        keyword("DROP"),
        _,
        c.removeType === RemoveType.TABLE
          ? keyword("TABLE")
          : c.removeType === RemoveType.SEQUENCE
          ? keyword("SEQUENCE")
          : keyword("VIEW"),
        _,
        ...(c.missing_ok ? [keyword("IF"), _, keyword("EXISTS"), _] : []),
        identifier(c.objects[0][0].String.str),
        ...(c.behavior === 1 ? [_, keyword("CASCADE")] : []),
        symbol(";"),
      ],
    ];
  }

  throw new Error();
}
