import { ColumnDef } from "../types";

import toConstraints from "./constraint";
import { comment, identifier, keyword, _, Block } from "./util";

// TODO Seperate params as symbols
export function toType(columnDef: ColumnDef): string {
  const names = (columnDef.typeName.names as any)
    .map((s: any) => s.String.str)
    .filter((s: any) => s !== "pg_catalog");

  if (names.length !== 1) {
    throw new Error("Unexpected type count");
  }

  const referencesCatalog =
    columnDef.typeName.names[0].String.str === "pg_catalog";

  const name = names[0];

  const typeWithParam = (t: string): string => {
    const val = columnDef.typeName.typmods?.[0].A_Const.val;
    const size = (val && "Integer" in val && val.Integer.ival) ?? null;
    if (!size) {
      return `${t}`;
    } else {
      return `${t}(${size})`;
    }
  };

  // TODO Add https://www.postgresql.org/docs/9.5/datatype.html
  // and pojo.
  switch (name.toLowerCase()) {
    case "timetz":
      if (!referencesCatalog) {
        return "timetz";
      } else {
        return "time with time zone";
      }
    case "timestamptz":
      if (!referencesCatalog) {
        return "timestamptz";
      } else {
        return "timestamp with time zone";
      }
    case "varchar":
      return typeWithParam(`varchar`);
    case "text":
      return "text";
    case "serial4":
      return "serial4";
    case "serial":
      return "serial";
    case "serial8":
      return "serial8";
    case "bigserial":
      return "bigserial";
    // case "integer":
    //   return "integer";
    case "smallint":
    case "int2":
      if (!referencesCatalog) {
        return "int2";
      } else {
        return "smallint";
      }
    case "int":
    case "integer":
    case "int4":
      if (!referencesCatalog) {
        return "int4";
      } else {
        return "integer";
      }
    case "int8":
    case "bigint":
      if (!referencesCatalog) {
        return "int8";
      } else {
        return "bigint";
      }
    case "bit":
      return typeWithParam(`bit`);
    case "bool":
      if (!referencesCatalog) {
        return "bool";
      } else {
        return "boolean";
      }
    case "float4":
      if (!referencesCatalog) {
        return "float4";
      } else {
        return "real";
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
        return "float8";
      } else {
        return "double precision";
      }

    case "bpchar": {
      const c = columnDef.typeName.typmods?.[0].A_Const;
      const val = columnDef.typeName.typmods?.[0].A_Const.val;
      const size = (val && "Integer" in val && val.Integer.ival) ?? null;
      const param = c?.location === -1 || size === 1 ? "" : `(${size})`;

      return `char${param}`;
    }
    case "interval": {
      const val = columnDef.typeName.typmods?.[0].A_Const.val;
      const size = (val && "Integer" in val && val.Integer.ival) ?? null;

      if (size === 1032) {
        return "interval day to hour";
      }
      return "interval";
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
            ? `(${size1}, ${size2})`
            : `(${size1})`
          : "";
      return `decimal${param}`;
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
      return name;
    default:
      return name;
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
      keyword(toType(columnDef)),
      ...toConstraints(constraints),
    ],
  ];
}
