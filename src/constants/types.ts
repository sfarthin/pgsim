// https://www.postgresql.org/docs/9.5/datatype.html
export const types = [
  {
    description: "signed eight-byte integer",
    name: "int8",
    alias: ["bigint"],
    maxParams: 0,
  },
  {
    description: "autoincrementing eight-byte integer",
    name: "bigserial",
    alias: [],
    maxParams: 0,
  },
  {
    description: "autoincrementing eight-byte integer",
    name: "serial8",
    alias: [],
    maxParams: 0,
  },
  {
    description: "variable-length bit string",
    name: "varbit",
    alias: ["bit varying"],
    maxParams: 1,
  },
  {
    description: "fixed-length bit string",
    name: "bit",
    alias: [],
    maxParams: 1,
  },
  {
    description: "logical Boolean (true/false)",
    name: "bool",
    alias: ["boolean"],
    maxParams: 0,
  },
  {
    description: "rectangular box on a plane",
    name: "box",
    alias: [],
    maxParams: 0,
  },
  {
    description: 'binary data ("byte array")',
    name: "bytea",
    alias: [],
    maxParams: 0,
  },

  {
    description: "variable-length character string",
    name: "varchar",
    alias: ["character varying"],
    maxParams: 1,
  },
  {
    description: "fixed-length character string",
    name: "bpchar",
    alias: ["character", "char"],
    maxParams: 1,
  },
  {
    description: "IPv4 or IPv6 network address",
    name: "cidr",
    alias: [],
    maxParams: 0,
  },
  {
    description: "circle on a plane",
    name: "circle",
    alias: [],
    maxParams: 0,
  },
  {
    description: "calendar date (year, month, day)",
    name: "date",
    alias: [],
    maxParams: 0,
  },
  {
    description: "double precision floating-point number (8 bytes)",
    name: "float8",
    alias: ["double precision", "float"],
    maxParams: 0,
  },
  {
    description: "IPv4 or IPv6 host address",
    name: "inet",
    alias: [],
    maxParams: 0,
  },
  {
    description: "signed four-byte integer",
    name: "int4",
    alias: ["integer", "int4", "int"],
    maxParams: 0,
  },
  {
    description: "time span",
    name: "interval",
    // This is kind of a hack, if multiple spaces or comments are put between these keywords,
    // our parser won't parse them correctly. In the future, we can probably improve this.
    alias: [
      "interval year",
      "interval month",
      "interval day",
      "interval hour",
      "interval minute",
      "interval second",
      "interval year to month",
      "interval day to hour",
      "interval day to month",
      "interval day to minute",
      "interval day to second",
      "interval hour to minute",
      "interval hour to second",
      "interval minute to second",
    ],
    maxParams: 0,
  },
  {
    description: "textual JSON data",
    name: "json",
    alias: [],
    maxParams: 0,
  },
  {
    description: "binary JSON data, decomposed",
    name: "jsonb",
    alias: [],
    maxParams: 0,
  },
  {
    description: "infinite line on a plane",
    name: "line",
    alias: [],
    maxParams: 0,
  },
  {
    description: "line segment on a plane",
    name: "lseg",
    alias: [],
    maxParams: 0,
  },

  {
    description: "MAC (Media Access Control) address",
    name: "macaddr",
    alias: [],
    maxParams: 0,
  },
  {
    description: "currency amount",
    name: "money",
    alias: [],
    maxParams: 0,
  },
  {
    description: "exact numeric of selectable precision",
    name: "numeric",
    alias: ["decimal"],
    maxParams: 2,
  },
  {
    description: "geometric path on a plane",
    name: "path",
    alias: [],
    maxParams: 0,
  },
  {
    description: "PostgreSQL Log Sequence Number",
    name: "pg_lsn",
    alias: [],
    maxParams: 0,
  },
  {
    description: "geometric point on a plane",
    name: "point",
    alias: [],
    maxParams: 0,
  },
  {
    description: "closed geometric path on a plane",
    name: "polygon",
    alias: [],
    maxParams: 0,
  },
  {
    description: "single precision floating-point number (4 bytes)",
    name: "float4",
    alias: ["real"],
    maxParams: 0,
  },
  {
    description: "signed two-byte integer",
    name: "int2",
    alias: ["smallint"],
    maxParams: 0,
  },
  {
    description: "autoincrementing two-byte integer",
    name: "serial2",
    alias: ["smallserial"],
    maxParams: 0,
  },
  {
    description: "autoincrementing four-byte integer",
    name: "serial4",
    alias: [],
    maxParams: 0,
  },
  {
    description: "autoincrementing four-byte integer",
    name: "serial",
    alias: [],
    maxParams: 0,
  },
  {
    description: "variable-length character string",
    name: "text",
    alias: [],
    maxParams: 0,
  },
  {
    description: "time of day (no time zone)",
    name: "time",
    alias: ["time without time zone"],
    maxParams: 1,
  },
  {
    description: "time of day, including time zone",
    name: "timetz",
    alias: ["time with time zone"],
    maxParams: 0,
  },

  {
    description: "date and time, including time zone",
    name: "timestamptz",
    alias: ["timestamp with time zone"],
    maxParams: 1,
  },
  {
    description: "date and time (no time zone)",
    name: "timestamp",
    alias: ["timestamp without time zone"],
    maxParams: 1,
  },
  {
    description: "text search query",
    name: "tsquery",
    alias: [],
    maxParams: 0,
  },
  {
    description: "text search document",
    name: "tsvector",
    alias: [],
    maxParams: 0,
  },
  {
    description: "user-level transaction ID snapshot",
    name: "txid_snapshot",
    alias: [],
    maxParams: 0,
  },
  {
    description: "universally unique identifier",
    name: "uuid",
    alias: [],
    maxParams: 0,
  },
  {
    description: "XML data",
    name: "xml",
    alias: [],
    maxParams: 0,
  },

  // Object Identifier Types
  // https://www.postgresql.org/docs/8.1/datatype-oid.html
  {
    description: "numeric object identifier",
    name: "oid",
    alias: [],
    maxParams: 0,
  },
  {
    description: "function name",
    name: "regproc",
    alias: [],
    maxParams: 0,
  },
  {
    description: "function with argument types",
    name: "regprocedure",
    alias: [],
    maxParams: 0,
  },
  {
    description: "operator name",
    name: "regoper",
    alias: [],
    maxParams: 0,
  },
  {
    description: "operator with argument types",
    name: "regoperator",
    alias: [],
    maxParams: 0,
  },
  {
    description: "relation name",
    name: "regclass",
    alias: [],
    maxParams: 0,
  },
  {
    description: "data type name",
    name: "regtype",
    alias: [],
    maxParams: 0,
  },
  {
    description: "System Catalog",
    name: "pg_catalog",
    alias: [],
    maxParams: 0,
  },
] as const;

export type TypeCatalog = typeof types;
export type TypeOrAlias =
  | TypeCatalog[number]["name"]
  | TypeCatalog[number]["alias"][number];

export const typeOrAlias: TypeOrAlias[] = types
  .flatMap((t) => [...t.alias, t.name])

  // NOTE order is important for the parser, "bit varying" needs to come before
  // "bit", for it to accurately parse.
  .slice()
  .sort((a, b) => {
    if (a.length < b.length) {
      return 1;
    } else {
      return -1;
    }
  });

export const includesReferenceCatalog: TypeOrAlias[] = [
  "interval year",
  "interval month",
  "interval day",
  "interval hour",
  "interval minute",
  "interval second",
  "interval year to month",
  "interval day to hour",
  "interval day to month",
  "interval day to minute",
  "interval day to second",
  "interval hour to minute",
  "interval hour to second",
  "interval minute to second",
  "time with time zone",
  "timestamp with time zone",
  "timestamp",
  "smallint",
  "integer",
  "bigint",
  "boolean",
  "real",
  "bit varying",
  "double precision",
  "bit",
  "int",
  "interval",
  "decimal",
  "numeric",
  "varchar",
  "char",
  "character",
  "character varying",
];

export const defaultTypeMods = {
  bit: 1,
  "interval year": 4,
  "interval month": 2,
  "interval day": 8,
  "interval hour": 1024,
  "interval minute": 2048,
  "interval second": 4096,
  "interval year to month": 6,
  "interval day to month": 6,
  "interval day to hour": 1032,
  "interval day to minute": 3080,
  "interval day to second": 7176,
  "interval hour to minute": 3072,
  "interval hour to second": 7168,
  "interval minute to second": 6144,
  char: 1,
  character: 1,
};
