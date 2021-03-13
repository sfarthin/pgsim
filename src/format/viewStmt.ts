import { ViewStmt } from "../types";
import { innerSelect } from "./selectStmt";
import comment from "./comment";
import { NEWLINE } from "./whitespace";

export default function viewStmt(c: ViewStmt): string {
  return `${comment(c.codeComment)}CREATE VIEW ${
    c.view.RangeVar.relname
  } AS (${NEWLINE}${innerSelect(c.query.SelectStmt, {
    numTabs: 1,
  })}${NEWLINE});${NEWLINE}`;
}
