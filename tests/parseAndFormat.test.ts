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
  const ast = parse(sql, filename);
  const realAst = nParse(sql);

  // Compare two ASTs
  // console.log(JSON.stringify(realAst, null, 2), JSON.stringify(ast, null, 2));

  // console.log(format(ast));
  // console.log(sql);

  // Make sure parser is identical to native parser
  expect(removeComments(ast)).toEqual(removeComments(realAst));

  // Make sure formatting and parsing produces the same AST
  expect(removeStyle(parse(format(ast)))).toEqual(removeStyle(ast));

  // Lets make sure we are aware of any changes
  expect(format(ast)).toMatchSnapshot();
}

describe("Parse and format", () => {
  for (const file in files) {
    // if (file === "createStmt.sql") {
    it(file, () => checkParserAndFormatter(files[file], file));
    // }
  }
});
