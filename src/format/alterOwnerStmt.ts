import { AlterOwnerStmt } from "../types";
import comment from "./comment";

export default function alterOwnerStmt(c: AlterOwnerStmt): string {
  return `${comment(c.comment)}ALTER TYPE ${c.object[0].String.str} OWNER TO ${
    c.newowner.RoleSpec.rolename
  };\n`;
}
