import { CreateSeqStmt, CreateSeqStmtOption } from "../toParser/createSeqStmt";

function option(option: CreateSeqStmtOption): string {
  if (option.DefElem.defname === "owned_by") {
    const hasTable = option.DefElem.arg.length === 2;
    if (hasTable) {
      const tableName = option.DefElem.arg[0].String.str;
      const colName = option.DefElem.arg[1].String.str;
      return `OWNED BY ${tableName}.${colName}`;
    } else {
      return `OWNED BY NONE`;
    }
  }

  if (["maxvalue", "minvalue", "cache"].includes(option.DefElem.defname)) {
    const value = option.DefElem.arg?.Integer.ival;
    const fieldName = option.DefElem.defname.toUpperCase();
    if (value) {
      return `${fieldName} ${value}`;
    } else {
      return `NO ${fieldName}`;
    }
  }

  if (option.DefElem.defname === "cycle") {
    const value = option.DefElem.arg?.Integer.ival;
    if (value === 1) {
      return "CYCLE";
    } else {
      return "NO CYCLE";
    }
  }

  if (option.DefElem.defname === "start") {
    const value = option.DefElem.arg?.Integer.ival;
    return `START WITH ${value}`;
  }

  if (option.DefElem.defname === "increment") {
    const value = option.DefElem.arg?.Integer.ival;
    return `INCREMENT BY ${value}`;
  }

  return "";
}

export default function createSeqStmt(c: CreateSeqStmt): string {
  const name = c.sequence.RangeVar.relname;
  return `CREATE SEQUENCE ${name} \n\t${c.options?.map(option).join("\n\t")};`;
}
