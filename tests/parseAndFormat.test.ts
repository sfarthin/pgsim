import parse from "../src/parse";
import nParse from "../src/nativeParse";
import format from "../src/format";
import omitDeep from "./omitDeep";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const files: { [s: string]: string } = readdirSync(
  join(__dirname, "./parseAndFormat")
).reduce((acc, file) => {
  if (!file.match(/\.sql$/)) {
    return acc;
  }
  return {
    ...acc,
    [file]: readFileSync(join(__dirname, "./parseAndFormat", file)).toString(),
  };
}, {});

function removeStyle(stmts: object[]): object {
  return (
    stmts
      .map((stmt) =>
        omitDeep(stmt, [
          // only in native parser
          "stmt_len",
          "stmt_location",

          // Only in PEGJS parser
          "comment",

          // different in each parser
          "location",
        ])
      )
      // Only in PEGJS parser
      .filter((stmt) => "Comment" in stmt)
  );
}

function checkParserAndFormatter(sql: string): void {
  const realAst = nParse(sql);
  const ast = parse(sql);

  // Compare two ASTs
  // console.log(JSON.stringify(realAst, null, 2), JSON.stringify(ast, null, 2));

  // Make sure parser is identical to native parser
  expect(removeStyle(realAst)).toEqual(removeStyle(ast));

  // Make sure formatting and parsing produces the same AST
  expect(removeStyle(parse(format(ast)))).toEqual(removeStyle(ast));

  // Lets make sure we are aware of any changes
  expect(ast).toMatchSnapshot();
  expect(format(ast)).toMatchSnapshot();
}

describe("Parse and format", () => {
  for (const file in files) {
    it(file, () => checkParserAndFormatter(files[file]));
  }
  // it("create a table with all kinds of columns", () => {
  //   checkParserAndFormatter(`
  //   CREATE TABLE a (
  //     -- integer
  //     aaa integer,
  //     aab int,
  //     aac int4,

  //     aa bigint,
  //     ab int8,
  //     ac bigserial,
  //     ad serial8,
  //     ae serial,
  //     af serial4,

  //     -- bit
  //     aba bit,
  //     abb bit(2),
  //     abc bit varying,
  //     abca bit varying(3),
  //     abd varbit,
  //     abda varbit(3),

  //     -- interval
  //     bba interval,
  //     bbb interval day to hour,

  //     -- boolean
  //     ba bool,
  //     bbaa boolean,

  //     -- misc
  //     caa box,
  //     cba bytea,
  //     cc cidr,
  //     cd circle,
  //     ce date,
  //     cf inet,
  //     cg line,
  //     ch lseg,
  //     ci macaddr,
  //     cj money,
  //     ck tsquery,
  //     cl tsvector,
  //     cm txid_snapshot,
  //     cn uuid,
  //     co xml,

  //     -- real
  //     daa real,
  //     dba float4,

  //     -- smallint
  //     dda smallint,
  //     ddb int2,

  //     -- float
  //     da double precision,
  //     db float8,

  //     -- decimal
  //     eaa decimal,
  //     eb numeric,
  //     eca decimal(5),
  //     ecb numeric(5),
  //     eccv decimal(5,2),
  //     ecd numeric(5,2),

  //     -- character
  //     bb character varying(255) NOT NULL,
  //     bc character varying(4),
  //     bd character varying,
  //     be varchar,
  //     bf varchar(255),
  //     bg character,
  //     bh character(4),
  //     bi char,
  //     bj char(4),
  //     bk text,

  //     -- timestamp
  //     caz timestamp with time zone NOT NULL,
  //     cbx timestamptz,
  //     cax time with time zone NOT NULL,
  //     cbxx timetz
  //   )
  // `);
  // });

  // it("set vars", () => {
  //   checkParserAndFormatter(`
  // SET statement_timeout = 0;
  // SET lock_timeout = 0;
  // SET client_encoding = 'UTF8';
  // SET standard_conforming_strings = on;
  // SET check_function_bodies = false;
  // SET client_min_messages = warning;
  // `);
  // });
});
