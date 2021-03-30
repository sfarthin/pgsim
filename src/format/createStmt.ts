import { CreateStmt, ColumnDef, Constraint } from "../types";
import comment from "./comment";
import toConstraints, { toTableConstraint } from "./constraint";
import { Formatter, addToLastLine } from "./util";

export function toType(columnDef: ColumnDef): string {
  const names = columnDef.typeName.TypeName.names
    .map((s) => s.String.str)
    .filter((s) => s !== "pg_catalog");

  if (names.length !== 1) {
    throw new Error("Unexpected type count");
  }

  const referencesCatalog =
    columnDef.typeName.TypeName.names[0].String.str === "pg_catalog";

  const name = names[0];

  const typeWithParam = (t: string): string => {
    const val = columnDef.typeName.TypeName.typmods?.[0].A_Const.val;
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
      const c = columnDef.typeName.TypeName.typmods?.[0].A_Const;
      const val = columnDef.typeName.TypeName.typmods?.[0].A_Const.val;
      const size = (val && "Integer" in val && val.Integer.ival) ?? null;
      const param = c?.location === -1 || size === 1 ? "" : `(${size})`;

      return `char${param}`;
    }
    case "interval": {
      const val = columnDef.typeName.TypeName.typmods?.[0].A_Const.val;
      const size = (val && "Integer" in val && val.Integer.ival) ?? null;

      if (size === 1032) {
        return "interval day to hour";
      }
      return "interval";
    }
    case "decimal": // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
    case "numeric": // variable	user-specified precision, exact	up to 131072 digits before the decimal point; up to 16383 digits after the decimal point
      const val1 = columnDef.typeName.TypeName.typmods?.[0].A_Const.val;
      const val2 = columnDef.typeName.TypeName.typmods?.[1]?.A_Const.val;
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

export function toColumn<T>(columnDef: ColumnDef, f: Formatter<T>): T[][] {
  const { identifier, keyword, _ } = f;
  const colname = columnDef.colname.match(/^[a-zA-Z][a-zA-Z0-9]*$/)
    ? columnDef.colname
    : JSON.stringify(columnDef.colname);

  const constraints = columnDef.constraints?.map((c) => c.Constraint) ?? [];

  return [
    ...comment(columnDef.codeComment, f),
    [
      identifier(colname),
      _,
      keyword(toType(columnDef)),
      ...toConstraints(constraints, f),
    ],
  ];
}

export default function <T>(createStmt: CreateStmt, f: Formatter<T>): T[][] {
  const { keyword, symbol, _, identifier, indent } = f;
  const tableName = createStmt.relation.RangeVar.relname;
  const schemaname = createStmt.relation.RangeVar.schemaname;

  const columnDefs = (
    createStmt.tableElts?.map((t) => ("ColumnDef" in t ? t.ColumnDef : null)) ??
    []
  ).filter((c) => !!c) as ColumnDef[];

  const constraints = (
    createStmt.tableElts?.map((t) =>
      "Constraint" in t ? t.Constraint : null
    ) ?? []
  ).filter((c) => !!c) as Constraint[];

  return [
    ...comment(createStmt.codeComment, f),
    [
      keyword("CREATE"),
      _,
      keyword("TABLE"),
      _,
      ...(schemaname ? [identifier(schemaname), symbol(".")] : []),
      identifier(tableName),
      _,
      symbol("("),
    ],
    ...indent([
      ...columnDefs.reduce(
        (acc, d, i) => [
          ...acc,
          ...(i === columnDefs.length - 1 && !constraints.length
            ? toColumn(d, f)
            : addToLastLine(toColumn(d, f), [symbol(",")])),
        ],
        [] as T[][]
      ),

      ...constraints.reduce(
        (acc, d) => [...acc, toTableConstraint(d, f)],
        [] as T[][]
      ),
    ]),
    [symbol(")"), symbol(";")],
  ];
}
