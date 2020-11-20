-- Test all different data types
-- https://www.postgresql.org/docs/9.5/datatype.html

CREATE TABLE aaa (
  -- signed eight-byte integer
  c0 bigint,
  c1 int8, 

  -- autoincrementing eight-byte integer
  c2 bigserial,
  c3 serial8,

  -- fixed-length bit string
  c4 bit,
  c5 bit(5),

  -- variable-length bit string
  c6 bit varying,
  c7 varbit,
  c8 bit varying(5),
  c9 varbit(5),

  -- logical Boolean (true/false)
  c10 boolean,
  c11 bool,

  -- rectangular box on a plane
  c12 box,

  -- binary data ("byte array")
  c13 bytea,

  -- fixed-length character string
  c14 character,
  c15 char,
  c16 character(5),
  c17 char(5),

  -- variable-length character string
  c18 character varying,
  c19 varchar,
  c20 character varying(5),
  c21 varchar(5),

  -- IPv4 or IPv6 network address
  c22 cidr,

  -- circle on a plane
  c23 circle,

  -- calendar date (year, month, day)
  c24 date,

  -- double precision floating-point number (8 bytes)
  c25 double precision,
  c26 float8,

  -- IPv4 or IPv6 host address
  c27 inet,

  -- signed four-byte integer
  c28 integer,
  c29 int, 
  c30 int4,

  -- time span
  -- Maybe not exhasutive here
  c31 interval,
  c32 interval(4),

  -- textual JSON data
  c33 json,

  -- binary JSON data, decomposed
  c34 jsonb,

  -- infinite line on a plane
  c35 line,

  -- line segment on a plane
  c36 lseg,

  -- MAC (Media Access Control) address
  c37 macaddr,

  -- currency amount
  c38 money,

  -- exact numeric of selectable precision
  c39 numeric,
  c40 decimal,
  c41 numeric(10,3),
  c42 decimal(10,3),

  -- geometric path on a plane
  c43 path,

  -- PostgreSQL Log Sequence Number
  c44 pg_lsn,

  -- geometric point on a plane
  c45 point,

  -- closed geometric path on a plane
  c46 polygon,

  -- single precision floating-point number (4 bytes)
  c47 real,
  c48 float4,

  -- signed two-byte integer
  c49 smallint,
  c50 int2,

  -- autoincrementing two-byte integer
  c51 smallserial,
  c52 serial2,

  -- autoincrementing four-byte integer
  c53 serial,
  c54 serial4,

  -- variable-length character string
  c55 text,

  -- time of day
  c56 time,
  c57 time(3),
  c58 time with time zone,
  c59 time(3) with time zone,

  -- timestamptz date and time
  c60 timestamp,
  c61 timestamp(3),
  c62 timestamp with time zone,
  c63 timestamp(3) with time zone,

  -- text search query
  c64 tsquery,

  -- text search document
  c65 tsvector,

  -- user-level transaction ID snapshot
  c66 txid_snapshot,

  -- universally unique identifier
  c67 uuid,

  -- XML data
  c68 xml	
);
