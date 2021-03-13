import { AlterSeqStmt } from "../types";
import defElem from "./defElem";
import comment from "./comment";
import { NEWLINE, TAB } from "./whitespace";

export default function alterSeqStmt(c: AlterSeqStmt): string {
  const name = c.sequence.RangeVar.relname;
  return `${comment(
    c.codeComment
  )}ALTER SEQUENCE ${name} ${NEWLINE}${c.options
    ?.map(
      (e) => `${comment(e.DefElem.codeComment, 1)}${TAB}${defElem(e.DefElem)}`
    )
    .join(NEWLINE)};${NEWLINE}`;
}
