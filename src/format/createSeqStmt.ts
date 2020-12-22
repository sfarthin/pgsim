import { CreateSeqStmt, DefElem } from "~/types";
import comment from "./comment";

export function defElem(defElem: DefElem): string {
  if (defElem.defname === "owned_by") {
    const hasTable = defElem.arg.length === 2;
    if (hasTable) {
      const tableName = defElem.arg[0].String.str;
      const colName = defElem.arg[1].String.str;
      return `OWNED BY ${tableName}.${colName}`;
    } else {
      return `OWNED BY NONE`;
    }
  }

  if (["maxvalue", "minvalue", "cache"].includes(defElem.defname)) {
    const value = defElem.arg?.Integer.ival;
    const fieldName = defElem.defname.toUpperCase();
    if (value) {
      return `${fieldName} ${value}`;
    } else {
      return `NO ${fieldName}`;
    }
  }

  if (defElem.defname === "cycle") {
    const value = defElem.arg?.Integer.ival;
    if (value === 1) {
      return "CYCLE";
    } else {
      return "NO CYCLE";
    }
  }

  if (defElem.defname === "start") {
    const value = defElem.arg?.Integer.ival;
    return `START WITH ${value}`;
  }

  if (defElem.defname === "increment") {
    const value = defElem.arg?.Integer.ival;
    return `INCREMENT BY ${value}`;
  }

  return "";
}

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
