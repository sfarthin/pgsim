import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import rawExpr from "./rawExpr";

export function innerSelect(c: SelectStmt, opts: { numTabs: number }): string {
  const sql = `${comment(c.comment)}SELECT ${c.targetList
    .map((v) => (v.ResTarget?.val ? rawExpr(v.ResTarget?.val) : false))
    .join(", ")}`;

  // Lets add the appropiate amount of tabs.
  const introTabs = [...new Array(opts.numTabs)].map(() => "\t").join("");
  return `${introTabs}${sql.split("\n").join(`\n${introTabs}`)}`;
}

export default function (c: SelectStmt): string {
  return `${innerSelect(c, { numTabs: 0 })};\n`;
}
