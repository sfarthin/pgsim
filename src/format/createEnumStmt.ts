import { CreateEnumStmt } from "../types";
import comment from "./comment";
import { NEWLINE, TAB } from "./whitespace";

export default function variableSetStmt(
  createEnumStmt: CreateEnumStmt
): string {
  // console.log(JSON.stringify(createEnumStmt, null, 2));
  return `${comment(createEnumStmt.codeComment)}CREATE TYPE ${
    createEnumStmt.typeName[0].String.str
  } AS ENUM (${NEWLINE}${createEnumStmt.vals
    .map((s) => `${comment(s.codeComment, 1)}${TAB}'${s.String.str}'`)
    .join(`,${NEWLINE}`)}${NEWLINE});${NEWLINE}`;
}
