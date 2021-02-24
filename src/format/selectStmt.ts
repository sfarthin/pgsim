import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import rawExpr from "./rawExpr";

const indent = (numTabs: number, sql: string) => {
  const introTabs = [...new Array(numTabs)].map(() => "\t").join("");
  return `${introTabs}${sql.split("\n").join(`\n${introTabs}`)}`;
};

export function innerSelect(c: SelectStmt, opts: { numTabs: number }): string {
  const select = `${comment(c.codeComment)}SELECT\n${indent(
    1,
    c.targetList
      .map((v) =>
        v.ResTarget?.val
          ? `${comment(v.codeComment)}${rawExpr(v.ResTarget?.val)}`
          : false
      )
      .join(", ")
  )}`;

  const from = c.fromClause
    ? `\nFROM\n${indent(
        1,
        c.fromClause
          .map((v) => `${comment(v.codeComment)}${v.RangeVar.relname}`)
          .join(", ")
      )}`
    : "";

  const where = c.whereClause
    ? `\nWHERE\n${indent(
        1,
        `${comment(c.whereClauseCodeComment)}${rawExpr(c.whereClause)}`
      )}`
    : "";

  const sql = `${select}${from}${where}`;

  // Lets add the appropiate amount of tabs.
  return indent(opts.numTabs, sql);
}

export default function (c: SelectStmt): string {
  return `${innerSelect(c, { numTabs: 0 })};\n`;
}
