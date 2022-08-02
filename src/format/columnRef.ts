import { ColumnRef } from "~/types";
import { identifier, symbol, Line } from "./util";

export default function columnRef(c: ColumnRef): Line {
  if ("A_Star" in c.fields[0]) {
    return [symbol("*")];
  }

  if (c.fields[1] && "A_Star" in c.fields[1] && "String" in c.fields[0]) {
    return [identifier(c.fields[0].String.str), symbol("."), symbol("*")];
  }

  if (c.fields[1] && "String" in c.fields[1] && "String" in c.fields[0]) {
    return [
      identifier(c.fields[0].String.str),
      symbol("."),
      identifier(c.fields[1].String.str),
    ];
  }

  if ("String" in c.fields[0]) {
    return [identifier(c.fields[0].String.str)];
  }

  throw new Error(`unhanded:`);
}
