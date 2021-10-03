import { DefElem } from "../types";
import { identifier, symbol, keyword, _, Line, integerLiteral } from "./util";

export default function defElem(defElem: DefElem): Line {
  if (defElem.defname === "owned_by") {
    const list = "List" in defElem.arg ? defElem.arg.List.items : [];
    if (list.length === 2) {
      const tableName = list[0].String.str;
      const colName = list[1].String.str;
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
      return [keyword(fieldName), _, integerLiteral(value)];
    } else {
      return [keyword("NO"), _, keyword(fieldName)];
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
    return [keyword("START"), _, keyword("WITH"), _, integerLiteral(value)];
  }

  if (defElem.defname === "increment") {
    const value = defElem.arg?.Integer.ival;
    if (!value) {
      throw new Error("Expectect argument");
    }
    return [keyword("INCREMENT"), _, keyword("BY"), _, integerLiteral(value)];
  }

  return [];
}
