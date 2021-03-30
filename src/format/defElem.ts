import { DefElem } from "../types";
import { Formatter } from "./util";

export default function defElem<T>(defElem: DefElem, f: Formatter<T>): T[] {
  const { identifier, symbol, keyword, _, number } = f;
  if (defElem.defname === "owned_by") {
    const hasTable = defElem.arg.length === 2;
    if (hasTable) {
      const tableName = defElem.arg[0].String.str;
      const colName = defElem.arg[1].String.str;
      return [
        keyword("OWNED"),
        _,
        keyword("BY"),
        _,
        identifier(tableName),
        symbol("."),
        identifier(colName),
      ];
    } else {
      return [keyword("OWNED"), _, keyword("BY"), _, keyword("NONE")];
    }
  }

  if (["maxvalue", "minvalue", "cache"].includes(defElem.defname)) {
    const value = defElem.arg?.Integer.ival;
    const fieldName = defElem.defname.toUpperCase();
    if (value) {
      return [keyword(fieldName), _, number(value)];
      `${fieldName} ${value}`;
    } else {
      return [keyword("NO"), _, identifier(fieldName)];
    }
  }

  if (defElem.defname === "cycle") {
    const value = defElem.arg?.Integer.ival;
    if (value === 1) {
      return [keyword("CYCLE")];
    } else {
      return [keyword("NO"), _, keyword("CYCLE")];
    }
  }

  if (defElem.defname === "start") {
    const value = defElem.arg?.Integer.ival;
    if (!value) {
      throw new Error("Expectect argument");
    }
    return [keyword("START"), _, keyword("WITH"), _, number(value)];
  }

  if (defElem.defname === "increment") {
    const value = defElem.arg?.Integer.ival;
    if (!value) {
      throw new Error("Expectect argument");
    }
    return [keyword("INCREMENT"), _, keyword("BY"), _, number(value)];
  }

  return [];
}
