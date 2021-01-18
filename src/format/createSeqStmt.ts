import { CreateSeqStmt } from "~/types";
import comment from "./comment";
import defElem from "./defElem";

export default function createSeqStmt(c: CreateSeqStmt): string {
  const name = c.sequence.RangeVar.relname;

  if (!c.options?.length) {
    return `${comment(c.comment)}CREATE SEQUENCE ${name};\n`;
  }

  return `${comment(c.comment)}CREATE SEQUENCE${
    c.if_not_exists ? " IF NOT EXISTS" : ""
  } ${name} \n${c.options
    ?.map((e) => `${comment(e.DefElem.comment, 1)}\t${defElem(e.DefElem)}`)
    .join("\n")};\n`;
}
