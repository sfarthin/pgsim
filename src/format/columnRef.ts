import { ColumnRef } from "../types";

export default function columnRef(c: ColumnRef) {
  if ("A_Star" in c.fields[0]) {
    return "*";
  }

  if (c.fields[1] && "A_Star" in c.fields[1] && "String" in c.fields[0]) {
    return `${c.fields[0].String.str}.*`;
  }

  if (c.fields[1] && "String" in c.fields[1] && "String" in c.fields[0]) {
    return `${c.fields[0].String.str}.${c.fields[1].String.str}`;
  }

  if ("String" in c.fields[0]) {
    return `${c.fields[0].String.str}`;
  }

  throw new Error(`unhanded:`);
}
