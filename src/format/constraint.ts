import { Constraint, ConType } from "~/types";
import { rawValue } from "./rawExpr";
import {
  join,
  keyword,
  _,
  identifier,
  symbol,
  Line,
  Block,
  toSingleLineIfPossible,
  indent,
} from "./util";

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

export function toConstraint(
  constraint: Constraint,
  fromAlterStmt?: boolean
): Block {
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

      let actions: Line = [];
      if (constraint.fk_upd_action && constraint.fk_upd_action != "a") {
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

      if (constraint.fk_del_action && constraint.fk_del_action != "a") {
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

      if (constraint.skip_validation) {
        actions = [...actions, _, keyword("NOT"), _, keyword("VALID")];
      }

      if (fromAlterStmt) {
        return [
          [
            ...con,
            keyword("FOREIGN"),
            _,
            keyword("KEY"),
            _,
            ...(fkColumns.length
              ? [symbol("("), ...fkColumns, symbol(")")]
              : []),
            _,
            keyword("REFERENCES"),
            _,
            table,
            ...(columns.length
              ? [_, symbol("("), ...columns, symbol(")")]
              : []),
            ...actions,
          ],
        ];
      } else {
        return [
          [
            ...con,
            keyword("REFERENCES"),
            _,
            table,
            ...(columns.length
              ? [_, symbol("("), ...columns, symbol(")")]
              : []),
            ...actions,
          ],
        ];
      }

    case ConType.PRIMARY_KEY:
      return [[...con, keyword("PRIMARY"), _, keyword("KEY"), ...keys]];
    case ConType.DEFAULT:
      return [
        [...con, keyword("DEFAULT"), _],
        ...rawValue(constraint.raw_expr),
      ];
    case ConType.NOT_NULL:
      return [[...con, keyword("NOT"), _, keyword("NULL")]];
    case ConType.NULL:
      return [[...con, keyword("NULL")]];
    case ConType.UNIQUE:
      return [[...con, keyword("UNIQUE"), ...keys]];
    case ConType.CHECK:
      return [
        [...con, keyword("CHECK"), _, symbol("(")],
        ...indent(rawValue(constraint.raw_expr)),
        [symbol(")")],
      ];
    default:
      throw new Error(`Unhandled constraint type: ${constraint.contype}`);
  }
}

export default function (
  constraints: Constraint[],
  fromAlterStmt?: boolean
): Block {
  if (constraints.length) {
    return constraints.reduce(
      (acc, c) =>
        toSingleLineIfPossible([...acc, ...toConstraint(c, fromAlterStmt)]),
      [] as Block
    );
  }
  return [];
}

export function toTableConstraint(constraint: Constraint): Line {
  switch (constraint.contype) {
    case ConType.PRIMARY_KEY:
      return [
        keyword("PRIMARY"),
        _,
        keyword("KEY"),
        _,
        symbol("("),
        ...(constraint.keys
          ? join(
              constraint.keys.map((v) => [identifier(v.String.str)]),
              [symbol(","), _]
            )
          : []),
        symbol(")"),
      ];
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
