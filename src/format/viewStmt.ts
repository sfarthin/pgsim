import { ViewStmt } from "../types";
import { innerSelect } from "./selectStmt";
import comment from "./comment";

export default function viewStmt(c: ViewStmt): string {
  return `${comment(c.codeComment)}CREATE VIEW ${
    c.view.RangeVar.relname
  } AS (\n${innerSelect(c.query.SelectStmt, { numTabs: 1 })}\n);\n`;
}
