import parse from "../src/parse";
import nParse from "../src/nativeParse";
import format from "../src/format";
import omitDeep from "./omitDeep";

function removeStyle(ast: object): object {
  return omitDeep(ast, ["location", "stmt_len", "stmt_location"]);
}

function expectFormatHasSameAst(sql: string): void {
  const ast1 = nParse(sql);
  const ast2 = parse(format(parse(sql)));

  expect(removeStyle(ast1)).toEqual(removeStyle(ast2));
}

describe("format", () => {
  it("create a table with all kinds of columns", () => {
    expectFormatHasSameAst(`
    CREATE TABLE a (
      -- integer
      aaa integer,
      aab int,
      aac int4,

      aa bigint,
      ab int8,
      ac bigserial,
      ad serial8,
      ae serial,
      af serial4,

      -- bit
      aba bit,
      abb bit(2),
      abc bit varying,
      abca bit varying(3),
      abd varbit,
      abda varbit(3),

      -- interval
      bba interval,
      bbb interval day to hour,

      -- boolean
      ba bool,
      bbaa boolean,

      -- misc
      caa box,
      cba bytea,
      cc cidr,
      cd circle,
      ce date,
      cf inet,
      cg line,
      ch lseg,
      ci macaddr,
      cj money,
      ck tsquery,
      cl tsvector,
      cm txid_snapshot,
      cn uuid,
      co xml,

      -- real
      daa real,
      dba float4,

      -- smallint
      dda smallint,
      ddb int2,

      -- float
      da double precision,
      db float8,

      -- decimal
      eaa decimal,
      eb numeric,
      eca decimal(5),
      ecb numeric(5),
      eccv decimal(5,2),
      ecd numeric(5,2),

      -- character
      bb character varying(255) NOT NULL,
      bc character varying(4),
      bd character varying,
      be varchar,
      bf varchar(255),
      bg character,
      bh character(4),
      bi char,
      bj char(4),
      bk text,

      -- timestamp
      caz timestamp with time zone NOT NULL,
      cbx timestamptz,
      cax time with time zone NOT NULL,
      cbxx timetz
    )
  `);
  });

  it("set vars", () => {
    expectFormatHasSameAst(`
      SET statement_timeout = 0;
      SET lock_timeout = 0;
      SET client_encoding = 'UTF8';
      SET standard_conforming_strings = on;
      SET check_function_bodies = false;
      SET client_min_messages = warning;
  `);
  });

  it("define enum", () => {
    expectFormatHasSameAst(`
      CREATE TYPE foo AS ENUM (
        'a',
        'b',
        'c',
        'd',
        'e'
      );`);
  });

  it("sequence", () => {
    expectFormatHasSameAst(`
    CREATE SEQUENCE foo
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      NO CYCLE
      CACHE 1
      OWNED BY NONE;

      CREATE SEQUENCE foo2
      MINVALUE 4
      MAXVALUE 6
      CYCLE
      OWNED BY foo.bar;
    `);
  });

  it("asd", () => {
    expectFormatHasSameAst(`ALTER SEQUENCE foo OWNED BY a.aaa;`);
  });

  it.only("can natively parse", () => {
    const sql = `
      CREATE SEQUENCE foo
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      NO CYCLE
      CACHE 1
      OWNED BY NONE;
    `;

    console.log(JSON.stringify(nParse(sql), null, 2));

    console.log(JSON.stringify(parse(sql), null, 2));
  });
});
