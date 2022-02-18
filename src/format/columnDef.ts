import { ColumnDef } from "../types";

import toConstraints from "./constraint";
import {
  comment,
  identifier,
  keyword,
  _,
  Block,
  Line,
  integerLiteral,
  symbol,
} from "./util";

// TODO Seperate params as symbols
export function toType(columnDef: ColumnDef): Line {
  const names = (columnDef.typeName.names as any)
    .map((s: any) => s.String.str)
    .filter((s: any) => s !== "pg_catalog");

  if (names.length !== 1) {
    throw new Error("Unexpected type count");
  }

  const referencesCatalog =
    columnDef.typeName.names[0].String.str === "pg_catalog";

  const name = names[0];

  const typeWithParam = (t: string): Line => {
    const val = columnDef.typeName.typmods?.[0].A_Const.val;
    const size = (val && "Integer" in val && val.Integer.ival) ?? null;
    if (!size) {
      return [keyword(`${t}`)];
    } else {
      return [keyword(t), symbol("("), integerLiteral(size), symbol(")")];
    }
  };

  // TODO Add https://www.postgresql.org/docs/9.5/datatype.html
  // and pojo.
  switch (name.toLowerCase()) {
    case "timetz":
      if (!referencesCatalog) {
        return [keyword("timetz")];
      } else {
        return [keyword("time with time zone")];
      }
    case "timestamptz":
      if (!referencesCatalog) {
        return [keyword("timestamptz")];
      } else {
        return [keyword("timestamp with time zone")];
      }
    case "varchar":
      return typeWithParam(`varchar`);
    case "text":
      return [keyword("text")];
    case "serial4":
      return [keyword("serial4")];
    case "serial":
      return [keyword("serial")];
    case "serial8":
      return [keyword("serial8")];
    case "bigserial":
      return [keyword("bigserial")];
    // case "integer":
    //   return "integer";
    case "smallint":
    case "int2":
      if (!referencesCatalog) {
        return [keyword("int2")];
      } else {
        return [keyword("smallint")];
      }
    case "int":
    case "integer":
    case "int4":
      if (!referencesCatalog) {
        return [keyword("int4")];
      } else {
        return [keyword("integer")];
      }
    case "int8":
    case "bigint":
      if (!referencesCatalog) {
        return [keyword("int8")];
      } else {
        return [keyword("bigint")];
      }
    case "bit":
      return typeWithParam(`bit`);
    case "bool":
      if (!referencesCatalog) {
        return [keyword("bool")];
      } else {
        return [keyword("boolean")];
      }
    case "float4":
      if (!referencesCatalog) {
        return [keyword("float4")];
      } else {
        return [keyword("real")];
      }
    case "bit varying":
    case "varbit":
      if (!referencesCatalog) {
        return typeWithParam("varbit");
      } else {
        return typeWithParam("bit varying");
      }

    case "float8":
      if (!referencesCatalog) {
        return [keyword("float8")];
      } else {
        return [keyword("double precision")];
      }

    case "bpchar": {
      const c = columnDef.typeName.typmods?.[0].A_Const;
      const val = columnDef.typeName.typmods?.[0].A_Const.val;
      const size = val && "Integer" in val ? val.Integer.ival : null;
      const param =
        size === null || c?.location === -1 || size === 1
          ? []
          : [symbol("("), integerLiteral(size), symbol(")")];

      return [keyword("char"), ...param];
    }
    case "interval": {
      const val = columnDef.typeName.typmods?.[0].A_Const.val;
      const size = (val && "Integer" in val && val.Integer.ival) ?? null;

      if (size === 1032) {
        return [keyword("interval day to hour")];
      }
      return [keyword("interval")];
    }
    case "decimal": // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
    case "numeric": // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
      const val1 = columnDef.typeName.typmods?.[0].A_Const.val;
      const val2 = columnDef.typeName.typmods?.[1]?.A_Const.val;
      const size1 = (val1 && "Integer" in val1 && val1.Integer.ival) ?? null;
      const size2 = (val2 && "Integer" in val2 && val2.Integer.ival) ?? null;

      const param =
        size1 || size2
          ? size1 && size2
            ? [
                symbol("("),
                integerLiteral(size1),
                symbol(","),
                integerLiteral(size2),
                symbol(")"),
              ]
            : size1
            ? [symbol("("), integerLiteral(size1), symbol(")")]
            : []
          : [];
      return [keyword("decimal"), ...param];
    case "box":
    case "bytea":
    case "cidr":
    case "circle":
    case "date":
    case "inet":
    case "line":
    case "lseg":
    case "macaddr":
    case "money":
    case "path":
    case "point":
    case "polygon":
    case "tsquery":
    case "tsvector":
    case "txid_snapshot":
    case "uuid":
    case "xml":
      return [keyword(name)];
    default:
      return [keyword(name)];
  }
}

export default function toColumn(columnDef: ColumnDef): Block {
  if (!columnDef.colname) {
    throw new Error("Expected column name");
  }

  const constraints = columnDef.constraints?.map((c) => c.Constraint) ?? [];

  return [
    ...comment(columnDef.codeComment),
    [
      identifier(columnDef.colname),
      _,
      ...toType(columnDef),
      ...toConstraints(constraints),
    ],
  ];
}
