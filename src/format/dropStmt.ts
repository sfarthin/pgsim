import { DropStmt, RemoveType } from "~/types";
import comment from "./comment";

export default function (c: DropStmt): string {
  if (c.removeType === RemoveType.TYPE) {
    return `${comment(c.comment)}DROP TYPE ${c.missing_ok ? "IF EXISTS " : ""}${
      c.objects[0].TypeName.names[0].String.str
    }${c.behavior === 1 ? " CASCADE" : ""};\n`;
  }

  if (c.removeType === RemoveType.TABLE) {
    return `${comment(c.comment)}DROP TABLE ${
      c.missing_ok ? "IF EXISTS " : ""
    }${c.objects[0][0].String.str}${c.behavior === 1 ? " CASCADE" : ""};\n`;
  }

  if (c.removeType === RemoveType.SEQUENCE) {
    return `${comment(c.comment)}DROP SEQUENCE ${
      c.missing_ok ? "IF EXISTS " : ""
    }${c.objects[0][0].String.str}${c.behavior === 1 ? " CASCADE" : ""};\n`;
  }

  throw new Error();
}
