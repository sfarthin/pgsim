import {
  or,
  keyword,
  transform,
  Rule,
  LPAREN,
  RPAREN,
  COMMA,
  sequence,
  __,
  combineComments,
} from "./util";
import { aConstInteger } from "./aConst";
import { A_Const, TypeName } from "../types";

const includesReferenceCatalog = [
  "time with time zone",
  "timestamp with time zone",
  "smallint",
  "integer",
  "bigint",
  "boolean",
  "real",
  "bit varying",
  "double precision",
  "bit",
  "int",
  "interval day to hour",
  "interval",
  "decimal",
  "numeric",
  "varchar",
  "char",
  "character",
  "character varying",
];

const colTypeMap = {
  "bit varying": "varbit",
  bigint: "int8",
  integer: "int4",
  int: "int4",
  "interval day to hour": "interval",
  boolean: "bool",
  real: "float4",
  smallint: "int2",
  "double precision": "float8",
  decimal: "numeric",
  char: "bpchar",
  character: "bpchar",
  "character varying": "varchar",
  "time with time zone": "timetz",
  "timestamp with time zone": "timestamptz",
};

const defaultTypeMods = {
  bit: 1,
  "interval day to hour": 1032,
  char: 1,
  character: 1,
};

const keywordSet = (arr: string[]): Rule<string> =>
  or(arr.map((s) => transform(keyword(s), (v) => v.value)) as [Rule<string>]);

// const colTypeWithParam = or([]);
const colTypeWithParamKeywords = [
  "bit varying",
  "varbit",
  "decimal",
  "numeric",
  "character varying",
  "varchar",
  "character",
  "char",
  "timestamp with time zone",
  "timestamptz",
  "timestamp",
  "timestamp without time zone",
  "time with time zone",
  "time without time zone",
  "timetz",
  "time",
  "bit",
];

const colTypeWithDoubleParamKeywords = ["decimal", "numeric"];

const colTypeNoParamKeywords = [
  ...colTypeWithParamKeywords,
  ...colTypeWithDoubleParamKeywords,
  "boolean",
  "bool",
  "box",
  "bytea",
  "cidr",
  "circle",
  "date",
  "inet",
  "line",
  "lseg",
  "macaddr",
  "money",
  "tsquery",
  "tsvector",
  "txid_snapshot",
  "uuid",
  "xml",
  "integer",
  "int4",
  "bigint",
  "int8",
  "bigserial",
  "serial4",
  "serial8",
  "serial",
  "real",
  "float4",
  "smallint",
  "int2",
  "double precision",
  "float8",
  "text",
  "date",
  "interval year to month",
  "interval day to hour",
  "interval day to minute",
  "interval day to second",
  "interval hour to minute",
  "interval hour to second",
  "interval minute to second",
  "interval year",
  "interval month",
  "interval day",
  "interval hour",
  "interval minute",
  "interval second",
  "interval",
  "int",
];

const colTypeWithParam = keywordSet(colTypeWithParamKeywords);

const colTypeWithDoubleParam = keywordSet(colTypeWithDoubleParamKeywords);

const colTypeNoParam = keywordSet(colTypeNoParamKeywords);

const getNames = (
  col: string
):
  | [{ String: { str: string } }]
  | [{ String: { str: string } }, { String: { str: string } }] => {
  const base = includesReferenceCatalog.includes(col.toLowerCase())
    ? [{ String: { str: "pg_catalog" } }]
    : [];

  // @ts-expect-error  -- we know we have exactly 2 here
  return base.concat({
    String: {
      str: (
        colTypeMap[col.toLowerCase() as keyof typeof colTypeMap] ?? col
      ).toLowerCase(),
    },
  });
};

const typemod = transform(aConstInteger, (val, ctx) => ({
  A_Const: { val, location: ctx.pos },
}));

const typeNameWithTwoParams: Rule<{
  value: TypeName;
  comment: string;
}> = transform(
  sequence([
    colTypeWithDoubleParam,
    __,
    LPAREN,
    __,
    typemod,
    __,
    COMMA,
    __,
    typemod,
    __,
    RPAREN,
  ]),
  (value, ctx) => {
    return {
      value: {
        names: getNames(value[0]),
        typemod: -1,
        typmods: [value[4], value[8]],
        location: ctx.pos,
      },
      comment: combineComments(
        value[1],
        value[3],
        value[5],
        value[7],
        value[9]
      ),
    };
  }
);

const typeNameWithParam: Rule<{ value: TypeName; comment: string }> = transform(
  sequence([colTypeWithParam, __, LPAREN, __, typemod, __, RPAREN]),
  (value, ctx) => {
    return {
      value: {
        names: getNames(value[0]),
        typemod: -1,
        typmods: [value[4]],
        location: ctx.pos,
      },
      comment: combineComments(value[1], value[3], value[5]),
    };
  }
);

const typeNameWithNoParam: Rule<{
  value: TypeName;
  comment: string;
}> = transform(colTypeNoParam, (value, ctx) => {
  const col = value;
  const typmods = defaultTypeMods[
    col.toLowerCase() as keyof typeof defaultTypeMods
  ]
    ? ([
        {
          A_Const: {
            val: {
              Integer: {
                ival:
                  defaultTypeMods[
                    col.toLowerCase() as keyof typeof defaultTypeMods
                  ],
              },
            },
            location:
              col.toLowerCase() === "interval day to hour" ? ctx.pos + 9 : -1,
          },
        },
      ] as [{ A_Const: A_Const }])
    : null;
  return {
    value: {
      names: getNames(value),
      typemod: -1,
      ...(typmods ? { typmods } : {}),
      location: ctx.pos,
    },
    comment: "",
  };
});

export const typeName: Rule<{ value: TypeName; comment: string }> = or([
  typeNameWithTwoParams,
  typeNameWithParam,
  typeNameWithNoParam,
]);
