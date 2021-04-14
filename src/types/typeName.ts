import * as d from "decoders";
import { stringDecoder, A_Const, aConstDecoder } from "./constant";
import { tuple1, tuple2 } from "./tuple1";
import { Location, locationDecoder } from "./location";

// https://www.postgresql.org/docs/9.5/datatype.html
export const types = [
  {
    description: "signed eight-byte integer",
    name: "int8",
    alias: ["bigint"],
    hasPGCatalog: false,
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
    hasPGCatalog: false,
  },
  {
    description: "variable-length bit string",
    name: "varbit",
    alias: ["bit varying"],
    hasPGCatalog: false,
  },
  {
    description: "logical Boolean (true/false)",
    name: "bool",
    alias: ["boolean"],
    hasPGCatalog: false,
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
    alias: ["double precision"],
    hasPGCatalog: false,
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
    alias: ["integer", "int4"],
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
    hasPGCatalog: false,
  },
  {
    description: "signed two-byte integer",
    name: "int2",
    alias: ["smallint"],
    hasPGCatalog: false,
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
    hasPGCatalog: false,
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
    hasPGCatalog: false,
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
] as const;

type T = typeof types;
export type TypeNameKeyword = T[number]["name"] | T[number]["alias"][number];

export function stringToType(s: string): T[number] {
  for (const type of types) {
    if (s === type.name || (type.alias as readonly string[]).includes(s)) {
      return type;
    }
  }

  throw new Error(`Invalid type ${s}`);
}

export type TypeName = {
  names:
    | [{ String: { str: "pg_catalog" } }, { String: { str: TypeNameKeyword } }]
    | [{ String: { str: TypeNameKeyword } }];
  typemod: number;
  typmods?:
    | [{ A_Const: A_Const }]
    | [{ A_Const: A_Const }, { A_Const: A_Const }];
  location: Location;
  arrayBounds?: unknown; // create table gin_test_tbl(i int4[]) with (autovacuum_enabled = off);
};

export const typeNameDecoder: d.Decoder<TypeName> = d.exact({
  names: d.either(tuple1(stringDecoder), tuple2(stringDecoder)) as d.Decoder<
    TypeName["names"]
  >,
  typemod: d.number,
  typmods: d.optional(
    d.either(
      tuple1(d.exact({ A_Const: aConstDecoder })),
      tuple2(d.exact({ A_Const: aConstDecoder }))
    )
  ),
  location: locationDecoder,
  arrayBounds: d.unknown,
});
