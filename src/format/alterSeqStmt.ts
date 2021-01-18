import { AlterSeqStmt } from "~/types";
import defElem from "./defElem";
import comment from "./comment";

export default function alterSeqStmt(c: AlterSeqStmt): string {
  const name = c.sequence.RangeVar.relname;
  return `${comment(c.comment)}ALTER SEQUENCE ${name} \n${c.options
    ?.map((e) => `${comment(e.DefElem.comment, 1)}\t${defElem(e.DefElem)}`)
    .join("\n")};\n`;
}
