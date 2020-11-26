import { AlterSeqStmt } from "~/types";
import { defElem } from "./createSeqStmt";

export default function alterSeqStmt(c: AlterSeqStmt): string {
  const name = c.sequence.RangeVar.relname;
  return `ALTER SEQUENCE ${name} \n\t${c.options
    ?.map((e) => defElem(e.DefElem))
    .join("\n\t")};`;
}
