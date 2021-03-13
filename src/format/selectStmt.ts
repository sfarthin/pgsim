import { SelectStmt } from "../types/selectStmt";
import comment from "./comment";
import rawExpr from "./rawExpr";
import { NEWLINE, TAB } from "./whitespace";

const indent = (numTabs: number, sql: string) => {
  const introTabs = [...new Array(numTabs)].map(() => TAB).join("");
  return `${introTabs}${sql.split(NEWLINE).join(`${NEWLINE}${introTabs}`)}`;
};

export function innerSelect(c: SelectStmt, opts: { numTabs: number }): string {
  const select = `${comment(c.codeComment)}SELECT${NEWLINE}${indent(
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
    ? `${NEWLINE}FROM${NEWLINE}${indent(
        1,
        c.fromClause
          .map((v) => `${comment(v.codeComment)}${v.RangeVar.relname}`)
          .join(", ")
      )}`
    : "";

  const where = c.whereClause
    ? `${NEWLINE}WHERE${NEWLINE}${indent(
        1,
        `${comment(c.whereClauseCodeComment)}${rawExpr(c.whereClause)}`
      )}`
    : "";

  const sql = `${select}${from}${where}`;

  // Lets add the appropiate amount of tabs.
  return indent(opts.numTabs, sql);
}

export default function (c: SelectStmt): string {
  return `${innerSelect(c, { numTabs: 0 })};${NEWLINE}`;
}
