import parse from "./parse";
import nParse from "./nativeParse";
import format from "./format";
import { Stmt } from "./types";
import assert from "assert";
import { join, basename } from "path";
import { lstatSync, readdirSync, readFileSync } from "fs";

function omitDeep(input: object, excludes: Array<number | string>): object {
  if (!input) {
    return input;
  }
  return Object.entries(input).reduce((acc, [key, value]) => {
    const shouldExclude = excludes.includes(key);
    if (shouldExclude) return acc;

    if (Array.isArray(value)) {
      const arrValue = value;
      const nextValue = arrValue.map((arrItem) => {
        if (typeof arrItem === "object") {
          return omitDeep(arrItem, excludes);
        }
        return arrItem;
      });

      return {
        ...acc,
        [key]: nextValue,
      };
    } else if (typeof value === "object") {
      return {
        ...acc,
        [key]: omitDeep(value, excludes),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

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

export default function verifySql(
  sql: string,
  filename: string
): { formattedSql: string; ast: Stmt[] } {
  // 1. First we validate the syntax is correct with real parser
  // 2. Then we ensure our type matches the native ast with the decoder
  const realAst = nParse(sql, basename(filename));

  // 3. Then we make sure our parser matches the output of the native parser
  const ast = parse(sql, basename(filename));

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

  // 4. Then we verify our formatter by confirmating it produces the same parsed AST
  const astNoStyle = removeStyle(ast);
  const formattedSql = format(ast, { sql, filename: basename(filename) });
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

  return { ast, formattedSql };
}

if (require.main === module) {
  if (process.argv[2]) {
    const filepath = join(process.cwd(), process.argv[2]);

    let files;
    if (lstatSync(filepath).isDirectory()) {
      files = readdirSync(filepath)
        .filter((f) => f.match(/\.sql$/))
        .map((f) => join(process.cwd(), process.argv[2], f));
    } else {
      files = [filepath];
    }

    for (const file of files) {
      verifySql(readFileSync(file).toString(), file);
    }
  } else {
    console.log(`Please provide a path!`);
  }
}
