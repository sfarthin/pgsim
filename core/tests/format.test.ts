import { format, parse } from "../src";
import omitDeep from "./omitDeep";

function removeStyle(ast: object): object {
  return omitDeep(ast, ["location", "stmt_len", "stmt_location"]);
}

function expectFormatHasSameAst(sql: string): void {
  const ast1 = parse(sql);
  const ast2 = parse(format(sql));
  console.log(sql, format(sql));
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
        abc bit varying(3),
        abd varbit,
        abd varbit(3),

        -- interval
        bba interval,
        bbb interval day to hour,

        -- boolean
        ba bool,
        bb boolean,

        -- misc
        ca box,
        cb bytea,
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
        da real,
        db float4,

        -- smallint
        dda smallint,
        ddb int2,

        -- float
        da double precision,
        db float8,

        -- decimal
        ea decimal,
        eb numeric,
        ec decimal(5),
        ec numeric(5),
        ec decimal(5,2),
        ec numeric(5,2),

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
        ca timestamp with time zone NOT NULL,
        cb timestamptz,
        ca time with time zone NOT NULL,
        cb timetz
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

  it.only("sequence", () => {
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
});
