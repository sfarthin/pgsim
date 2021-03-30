import { ColumnRef } from "../types";
import { Formatter } from "./util";

export default function columnRef<T>(c: ColumnRef, f: Formatter<T>): T[] {
  const { identifier, symbol } = f;
  if ("A_Star" in c.fields[0]) {
    return [identifier("*")];
  }

  if (c.fields[1] && "A_Star" in c.fields[1] && "String" in c.fields[0]) {
    return [identifier(c.fields[0].String.str), symbol("."), identifier("*")];
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
