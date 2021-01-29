import { Constraint, ConType } from "../types";
import rawExpr from "./rawExpr";

export function toConstraint(constraint: Constraint): string {
  switch (constraint.contype) {
    case ConType.FOREIGN_KEY:
      const table = constraint.pktable.RangeVar.relname.toLowerCase();
      const columns = constraint.pk_attrs
        ? `(${constraint.pk_attrs?.map((v) => v.String.str).join(", ")})`
        : "";
      return `REFERENCES ${table}${columns}`;
    case ConType.PRIMARY_KEY:
      return "PRIMARY KEY";
    case ConType.DEFAULT:
      return `DEFAULT ${rawExpr(constraint.raw_expr)}`;
    case ConType.NOT_NULL:
      return "NOT NULL";
    case ConType.NULL:
      return "NULL";
    case ConType.UNIQUE:
      return "UNIQUE";
    default:
      throw new Error(`Unhandled constraint type: ${constraint.contype}`);
  }
}

export default function (constraints: Constraint[]): string {
  if (constraints.length) {
    return ` ${constraints.map(toConstraint).join(" ")}`;
  }
  return "";
}

export function toTableConstraint(constraint: Constraint): string {
  switch (constraint.contype) {
    case ConType.FOREIGN_KEY:
      return `\tFOREIGN KEY (${constraint.fk_attrs
        ?.map((v) => v.String.str)
        .join(", ")}) REFERENCES ${
        constraint.pktable.RangeVar.relname
      } (${constraint.pk_attrs?.map((v) => v.String.str).join(", ")})`;
    default:
      throw new Error(`Unhandled constraint type: ${constraint.contype}`);
  }
}
