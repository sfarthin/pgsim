import { Constraint, ConType } from "../types";
import { rawValue } from "./rawExpr";
import { Formatter, join } from "./util";

function referentialActionOption(v: "r" | "c" | "n" | "a" | "d") {
  switch (v) {
    case "r":
      return "RESTRICT";
    case "c":
      return "CASCADE";
    case "n":
      return "SET NULL";
    case "a":
      return "NO ACTION";
    case "d":
      return "SET DEFAULT";
  }
}

export function toConstraint<T>(
  constraint: Constraint,
  f: Formatter<T>,
  fromAlterStmt?: boolean
): T[] {
  const { keyword, _, identifier, symbol } = f;
  const con =
    "conname" in constraint && constraint.conname
      ? [keyword("CONSTRAINT"), _, identifier(constraint.conname), _]
      : [];

  const keys =
    "keys" in constraint && constraint.keys
      ? [
          _,
          symbol("("),
          ...join(
            constraint.keys.map((j) => [identifier(j.String.str)]),
            [symbol(","), _]
          ),
          symbol(")"),
        ]
      : [];

  switch (constraint.contype) {
    case ConType.FOREIGN_KEY:
      const table = identifier(constraint.pktable.relname.toLowerCase());
      const columns = constraint.pk_attrs
        ? join(
            constraint.pk_attrs?.map((v) => [identifier(v.String.str)]),
            [symbol(","), _]
          )
        : [];

      const fkColumns = constraint.fk_attrs
        ? join(
            constraint.fk_attrs.map((v) => [identifier(v.String.str)]),
            [symbol(","), _]
          )
        : [];

      let actions: T[] = [];
      if (constraint.fk_upd_action) {
        actions = [
          ...actions,
          _,
          keyword("ON"),
          _,
          keyword("UPDATE"),
          _,
          keyword(referentialActionOption(constraint.fk_upd_action)),
        ];
      }

      if (constraint.fk_del_action) {
        actions = [
          ...actions,
          _,
          keyword("ON"),
          _,
          keyword("DELETE"),
          _,
          keyword(referentialActionOption(constraint.fk_del_action)),
        ];
      }

      if (fromAlterStmt) {
        return [
          ...con,
          keyword("FOREIGN"),
          _,
          keyword("KEY"),
          _,
          ...(fkColumns.length ? [symbol("("), ...fkColumns, symbol(")")] : []),
          _,
          keyword("REFERENCES"),
          _,
          table,
          ...(columns.length ? [_, symbol("("), ...columns, symbol(")")] : []),
          ...actions,
        ];
      } else {
        return [
          ...con,
          keyword("REFERENCES"),
          _,
          table,
          ...(columns.length ? [_, symbol("("), ...columns, symbol(")")] : []),
        ];
      }

    case ConType.PRIMARY_KEY:
      return [...con, keyword("PRIMARY"), _, keyword("KEY"), ...keys];
    case ConType.DEFAULT:
      return [
        ...con,
        keyword("DEFAULT"),
        _,
        ...rawValue(constraint.raw_expr, f).flat(),
      ];
    case ConType.NOT_NULL:
      return [...con, keyword("NOT"), _, keyword("NULL")];
    case ConType.NULL:
      return [...con, keyword("NULL")];
    case ConType.UNIQUE:
      return [...con, keyword("UNIQUE"), ...keys];
    default:
      throw new Error(`Unhandled constraint type: ${constraint.contype}`);
  }
}

export default function <T>(
  constraints: Constraint[],
  f: Formatter<T>,
  fromAlterStmt?: boolean
): T[] {
  const { _ } = f;
  if (constraints.length) {
    return constraints.reduce(
      (acc, c) => [...acc, _, ...toConstraint(c, f, fromAlterStmt)],
      [] as T[]
    );
  }
  return [];
}

export function toTableConstraint<T>(
  constraint: Constraint,
  f: Formatter<T>
): T[] {
  const { keyword, _, symbol, identifier } = f;
  switch (constraint.contype) {
    case ConType.FOREIGN_KEY:
      return [
        keyword("FOREIGN"),
        _,
        keyword("KEY"),
        _,
        symbol("("),
        ...(constraint.fk_attrs
          ? join(
              constraint.fk_attrs.map((v) => [identifier(v.String.str)]),
              [symbol(","), _]
            )
          : []),
        symbol(")"),
        _,
        keyword("REFERENCES"),
        _,
        identifier(constraint.pktable.relname),
        _,
        symbol("("),
        ...(constraint.pk_attrs
          ? join(
              constraint.pk_attrs?.map((v) => [identifier(v.String.str)]),
              [symbol(","), _]
            )
          : []),
        symbol(")"),
      ];
    default:
      throw new Error(`Unhandled constraint type: ${constraint.contype}`);
  }
}
