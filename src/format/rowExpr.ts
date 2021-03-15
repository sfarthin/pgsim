import { RowExpr } from "../types";
import rawExpr from "./rawExpr";

export default function rowExpr(c: RowExpr): string {
  return `(${c.args.map((a) => rawExpr(a)).join(", ")})`;
}
