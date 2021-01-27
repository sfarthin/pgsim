import parse from "../src/parse";
import nParse from "../src/nativeParse";
import format from "../src/format";
import omitDeep from "./omitDeep";
import { Stmt } from "../src/types";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

import assert from "assert";

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
  const statementName = filename.replace(/\..*$/gi, "");

  // 1. First we validate the syntax is correct with real parser
  // 2. Then we ensure our type matches the native ast with the decoder
  const realAst = nParse(sql);

  // 3. Make sure the filename should match the statement type.
  const unexpectedStatement = realAst.find(
    (s: Stmt) =>
      Object.keys(s.RawStmt.stmt)[0].toLowerCase() !==
        statementName.toLowerCase() &&
      Object.keys(s.RawStmt.stmt)[0].toLowerCase() !== "comment"
  );
  if (unexpectedStatement) {
    const start = unexpectedStatement.RawStmt.stmt_location ?? 0;
    const end = unexpectedStatement.RawStmt.stmt_len ?? 99999;
    const rawSql = sql.substring(start, start + end);
    throw new Error(
      `Expected "${statementName}", but got "${
        Object.keys(unexpectedStatement)[0]
      }"\n\n\u001b[44;1m${rawSql}\u001b[0m`
    );
  }

  // 4. Then we make sure our parser matches the output of the native parser
  const ast = parse(sql, filename);
  const astNoComments = removeComments(ast);
  const actualAstNoComments = removeComments(realAst);
  for (const key in astNoComments) {
    const start = astNoComments[key].RawStmt.stmt_location ?? 0;
    const end = astNoComments[key].RawStmt.stmt_len ?? 99999;
    const rawSql = sql.substring(start, start + end);
    assert.deepStrictEqual(
      astNoComments[key],
      actualAstNoComments[key],
      `AST does not match native parser for statement (${Number(key) + 1} of ${
        astNoComments.length
      }):\n\n\u001b[44;1m${rawSql.split("\n").join("\n\u001b[44;1m")}\u001b[0m`
    );
  }

  // 5. Then we verify our formatter by confirmating it produces the same parsed AST
  const astNoStyle = removeStyle(ast);
  const formattedSql = format(ast, { sql, filename });
  const formattedAst = parse(formattedSql);
  const formattedAstNoStyle = removeStyle(formattedAst);

  for (const key in astNoStyle) {
    const startAst = ast[key].RawStmt.stmt_location ?? 0;
    const endAst = ast[key].RawStmt.stmt_len ?? 99999;
    const originalSql = sql.substring(startAst, startAst + endAst);

    const startFormattedAst = formattedAst[key].RawStmt.stmt_location ?? 0;
    const endFormattedAst = formattedAst[key].RawStmt.stmt_len ?? 99999;
    const formattedSqlStmt = formattedSql.substring(
      startFormattedAst,
      startFormattedAst + endFormattedAst
    );

    assert.deepStrictEqual(
      astNoStyle[key],
      formattedAstNoStyle[key],
      `Formatter does not produce the same AST (${Number(key) + 1} of ${
        astNoStyle.length
      }):\n\nCorrect:\n\u001b[45m${originalSql
        .split("\n")
        .join(
          "\n\u001b[44;1m"
        )}\u001b[0m\n\nFormatter:\n\u001b[45m${formattedSqlStmt
        .split("\n")
        .join("\n\u001b[44;1m")}`
    );
  }

  // 6. If there are any changes at all (including formatting changes in comments), lets take not in the snapshot
  expect(format(ast)).toMatchSnapshot();
}

describe("Parse and format", () => {
  for (const file in files) {
    // if (file === "createSeqStmt.sql") {
    it(file, () => checkParserAndFormatter(files[file], file));
    // }
  }
});
