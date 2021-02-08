import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import rawExpr from "./rawExpr";

export default function (c: SelectStmt): string {
  return `${comment(c.comment)}SELECT ${c.targetList
    .map((v) => (v.ResTarget?.val ? rawExpr(v.ResTarget?.val) : false))
    .join(", ")};\n`;
}
