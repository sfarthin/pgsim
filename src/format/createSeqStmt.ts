import { CreateSeqStmt } from "../types";
import comment from "./comment";
import defElem from "./defElem";
import { NEWLINE, TAB } from "./whitespace";

export default function createSeqStmt(c: CreateSeqStmt): string {
  const name = c.sequence.RangeVar.relname;

  if (!c.options?.length) {
    return `${comment(c.codeComment)}CREATE SEQUENCE ${name};${NEWLINE}`;
  }

  return `${comment(c.codeComment)}CREATE SEQUENCE${
    c.if_not_exists ? " IF NOT EXISTS" : ""
  } ${name} ${NEWLINE}${c.options
    ?.map(
      (e) => `${comment(e.DefElem.codeComment, 1)}${TAB}${defElem(e.DefElem)}`
    )
    .join(NEWLINE)};${NEWLINE}`;
}
