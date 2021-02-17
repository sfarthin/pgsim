import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import rawExpr from "./rawExpr";

export function innerSelect(c: SelectStmt, opts: { numTabs: number }): string {
  const select = `${comment(c.comment)}SELECT\n\t${c.targetList
    .map((v) => (v.ResTarget?.val ? rawExpr(v.ResTarget?.val) : false))
    .join(", ")}`;

  const from = c.fromClause
    ? `\nFROM\n\t${c.fromClause.map((v) => v.RangeVar.relname).join(", ")}`
    : "";

  const where = c.whereClause ? `\nWHERE\n\t${rawExpr(c.whereClause)}` : "";

  const sql = `${select}${from}${where}`;

  // Lets add the appropiate amount of tabs.
  const introTabs = [...new Array(opts.numTabs)].map(() => "\t").join("");
  return `${introTabs}${sql.split("\n").join(`\n${introTabs}`)}`;
}

export default function (c: SelectStmt): string {
  return `${innerSelect(c, { numTabs: 0 })};\n`;
}
