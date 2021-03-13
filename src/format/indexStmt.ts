import { IndexStmt } from "../types";
import comment from "./comment";
import { NEWLINE } from "./whitespace";

export default function (c: IndexStmt): string {
  return `${comment(c.codeComment)}CREATE${c.unique ? " UNIQUE" : ""} INDEX${
    c.idxname ? ` ${c.idxname}` : ""
  } ON ${c.relation.RangeVar.relname}${
    c.accessMethod && c.accessMethod !== "btree"
      ? ` USING ${c.accessMethod}`
      : ""
  } (${c.indexParams.map((v) => v.IndexElem.name).join(", ")});${NEWLINE}`;
}
