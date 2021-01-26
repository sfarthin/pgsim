import parse from "../src/parse";
import nParse from "../src/nativeParse";
import format from "../src/format";
import omitDeep from "./omitDeep";
import { Stmt } from "../src/types";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * By ensuring the native parser is verified by the decoder
 * and the PEG.js parser matches the base output of the
 * native parser, we can verify the PEG.js is a valid superset
 */

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

function removeComments(stmts: Stmt[]): Stmt[] {
  return (
    (stmts.map((stmt) =>
      omitDeep(stmt as object, [
        // Only in new parser
        "comment",
      ])
    ) as Stmt[])
      // Only in PEGJS parser
      .filter((stmt) => !("Comment" in stmt.RawStmt.stmt))
  );
}

function removeStyle(stmts: Stmt[]): Stmt[] {
  return stmts.map((stmt) =>
    omitDeep(stmt as object, [
      // These vary slightly from the native parser and our parser
      "stmt_len",
      "stmt_location",

      // different in each parser
      "location",
    ])
  ) as Stmt[];
}

function checkParserAndFormatter(sql: string, filename: string): void {
  // 1. first ensure we have a correct type defined by using the native parser and decoding the output
  const realAst = nParse(sql);
  // console.log(JSON.stringify(realAst, null, 2));

  // 2. Make sure our parser is identical to native parser
  const ast = parse(sql, filename);
  expect(removeComments(ast)).toEqual(removeComments(realAst));

  // 3. Verify our formatted by confirming our formated SQL produces the same parsed AST
  expect(removeStyle(parse(format(ast)))).toEqual(removeStyle(ast));

  // 3. Lets make note of any changes after parsing then formattting.
  expect(format(ast)).toMatchSnapshot();
}

describe("Parse and format", () => {
  for (const file in files) {
    // if (file === "createSeqStmt.sql") {
    it(file, () => checkParserAndFormatter(files[file], file));
    // }
  }
});
