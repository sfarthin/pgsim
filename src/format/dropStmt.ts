import { DropStmt, RemoveType } from "~/types";
import { comment, Block, keyword, _, identifier, symbol } from "./util";

export default function (c: DropStmt): Block {
  if (c.removeType === RemoveType.OBJECT_TYPE) {
    return [
      ...comment(c.codeComment),
      [
        keyword("DROP"),
        _,
        keyword("TYPE"),
        _,
        ...(c.missing_ok ? [keyword("IF"), _, keyword("EXISTS"), _] : []),
        identifier(c.objects[0].TypeName.names[0].String.str),
        ...(c.behavior === "DROP_CASCADE" ? [_, keyword("CASCADE")] : []),
        symbol(";"),
      ],
    ];
  }

  if (
    c.removeType === RemoveType.OBJECT_TABLE ||
    c.removeType === RemoveType.OBJECT_SEQUENCE ||
    c.removeType === RemoveType.OBJECT_VIEW
  ) {
    return [
      ...comment(c.codeComment),
      [
        keyword("DROP"),
        _,
        c.removeType === RemoveType.OBJECT_TABLE
          ? keyword("TABLE")
          : c.removeType === RemoveType.OBJECT_SEQUENCE
          ? keyword("SEQUENCE")
          : keyword("VIEW"),
        _,
        ...(c.missing_ok ? [keyword("IF"), _, keyword("EXISTS"), _] : []),
        identifier(
          Array.isArray(c.objects[0].List.items)
            ? c.objects[0].List.items[0].String.str
            : c.objects[0].List.items.String.str
        ),
        ...(c.behavior === "DROP_CASCADE" ? [_, keyword("CASCADE")] : []),
        symbol(";"),
      ],
    ];
  }

  throw new Error();
}
