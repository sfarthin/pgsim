import { AlterEnumStmt } from "../types";
import comment from "./comment";
import { NEWLINE } from "./whitespace";

const beforeAndAfter = (c: AlterEnumStmt): string => {
  if (!("oldVal" in c)) {
    if (!c.newValIsAfter && c.newValNeighbor) {
      return ` BEFORE '${c.newValNeighbor}'`;
    }

    if (c.newValNeighbor) {
      return ` AFTER '${c.newValNeighbor}'`;
    }
  }

  return "";
};

export default function alterEnumStmt(c: AlterEnumStmt): string {
  if ("oldVal" in c) {
    return `${comment(c.codeComment)}ALTER TYPE foo RENAME VALUE '${
      c.oldVal
    }' TO '${c.newVal}';${NEWLINE}`;
  }

  return `${comment(c.codeComment)}ALTER TYPE ${
    c.typeName[0].String.str
  } ADD VALUE${c.skipIfNewValExists ? " IF NOT EXISTS" : ""} '${
    c.newVal
  }'${beforeAndAfter(c)};${NEWLINE}`;
}
