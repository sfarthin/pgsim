// https://www.postgresql.org/docs/9.5/datatype.html
export const types = [
  {
    description: "signed eight-byte integer",
    name: "int8",
    alias: ["bigint"],
    hasPGCatalog: true,
  },
  {
    description: "autoincrementing eight-byte integer",
    name: "serial8",
    alias: ["bigserial"],
    hasPGCatalog: false,
  },
  {
    description: "fixed-length bit string",
    name: "bit",
    alias: [],
    hasPGCatalog: true,
  },
  {
    description: "variable-length bit string",
    name: "varbit",
    alias: ["bit varying"],
    hasPGCatalog: true,
  },
  {
    description: "logical Boolean (true/false)",
    name: "bool",
    alias: ["boolean"],
    hasPGCatalog: true,
  },
  {
    description: "rectangular box on a plane",
    name: "box",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: 'binary data ("byte array")',
    name: "bytea",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "fixed-length character string",
    name: "char",
    alias: ["character"],
    hasPGCatalog: false,
  },
  {
    description: "variable-length character string",
    name: "varchar",
    alias: ["character varying"],
    hasPGCatalog: false,
  },
  {
    description: "IPv4 or IPv6 network address",
    name: "cidr",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "circle on a plane",
    name: "circle",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "calendar date (year, month, day)",
    name: "date",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "double precision floating-point number (8 bytes)",
    name: "float8",
    alias: ["double precision", "float"],
    hasPGCatalog: true,
  },
  {
    description: "IPv4 or IPv6 host address",
    name: "inet",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "signed four-byte integer",
    name: "int4",
    alias: ["integer", "int4", "int"],
    hasPGCatalog: true,
  },
  {
    description: "time span",
    name: "interval",
    alias: [],
    hasPGCatalog: true,
  },
  {
    description: "textual JSON data",
    name: "json",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "binary JSON data, decomposed",
    name: "jsonb",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "infinite line on a plane",
    name: "line",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "line segment on a plane",
    name: "lseg",
    alias: [],
    hasPGCatalog: false,
  },

  {
    description: "MAC (Media Access Control) address",
    name: "macaddr",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "currency amount",
    name: "money",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "exact numeric of selectable precision",
    name: "decimal",
    alias: ["numeric"],
    hasPGCatalog: false,
  },
  {
    description: "geometric path on a plane",
    name: "path",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "PostgreSQL Log Sequence Number",
    name: "pg_lsn",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "geometric point on a plane",
    name: "point",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "closed geometric path on a plane",
    name: "polygon",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "single precision floating-point number (4 bytes)",
    name: "float4",
    alias: ["real"],
    hasPGCatalog: true,
  },
  {
    description: "signed two-byte integer",
    name: "int2",
    alias: ["smallint"],
    hasPGCatalog: true,
  },
  {
    description: "autoincrementing two-byte integer",
    name: "serial2",
    alias: ["smallserial"],
    hasPGCatalog: false,
  },
  {
    description: "autoincrementing four-byte integer",
    name: "serial4",
    alias: ["serial"],
    hasPGCatalog: false,
  },
  {
    description: "variable-length character string",
    name: "text",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "time of day (no time zone)",
    name: "time",
    alias: [],
    hasPGCatalog: true,
  },
  {
    description: "time of day, including time zone",
    name: "timetz",
    alias: ["time with time zone"],
    hasPGCatalog: true,
  },
  {
    description: "date and time (no time zone)",
    name: "timestamp",
    alias: [],
    hasPGCatalog: true,
  },
  {
    description: "date and time, including time zone",
    name: "timestamptz",
    alias: ["timestamp with time zone"],
    hasPGCatalog: true,
  },
  {
    description: "text search query",
    name: "tsquery",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "text search document",
    name: "tsvector",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "user-level transaction ID snapshot",
    name: "txid_snapshot",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "universally unique identifier",
    name: "uuid",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "XML data",
    name: "xml",
    alias: [],
    hasPGCatalog: false,
  },

  // Object Identifier Types
  // https://www.postgresql.org/docs/8.1/datatype-oid.html
  {
    description: "numeric object identifier",
    name: "oid",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "function name",
    name: "regproc",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "function with argument types",
    name: "regprocedure",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "operator name",
    name: "regoper",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "operator with argument types",
    name: "regoperator",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "relation name",
    name: "regclass",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "data type name",
    name: "regtype",
    alias: [],
    hasPGCatalog: false,
  },
  {
    description: "System Catalog",
    name: "pg_catalog",
    alias: [],
    hasPGCatalog: false,
  },
] as const;

export type TypeCatalog = typeof types;
export type TypeOrAlias =
  | TypeCatalog[number]["name"]
  | TypeCatalog[number]["alias"][number];

export const typeOrAlias: TypeOrAlias[] = types.flatMap((t) => [
  t.name,
  ...t.alias,
]);
