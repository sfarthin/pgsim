import parse, { parseComments } from "../parse";
import { toLineAndColumn, findNextToken } from "../parse/error";
import nParse from "./nativeParse";
import format from "../format";
import { Stmt } from "../types";
import { join, basename } from "path";
import { lstatSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { json as assertNoDiff } from "assert-no-diff";
import c from "ansi-colors";
import { NEWLINE } from "../format/util";

/**
 * By ensuring the native parser is verified by the decoder
 * and the our parser matches the base output of the
 * native parser, we can verify that our parser is a valid superset.
 *
 * Similarly, we ensure our formatter matches...
 */

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

/**
 * Concat the comments together from the AST.
 */
function concatAllCodeComments(input: any): string[] {
  if (!input) {
    return [""];
  }
  if (typeof input?.Comment === "string") {
    return input?.Comment.split(/\s/);
  }

  return Object.entries(input).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return acc.concat([
        ...(value.reduce(
          (acc, a) => [...acc, ...concatAllCodeComments(a)],
          []
        ) as string[]),
      ]);
    } else if (key === "codeComments") {
      return acc.concat(
        Object.values(value as any)
          .flat()
          .filter(Boolean)
          .map((c: any) => c.split(/\s/))
          .flat()
      );
    } else if (typeof value === "object") {
      return acc.concat(concatAllCodeComments(value));
    } else if (key === "codeComment") {
      return acc.concat((value as any).split(/\s/) as string[]);
    }

    return acc;
  }, [] as string[]);
}

function removeComments(stmts: Stmt[]): Stmt[] {
  return (
    (stmts.map((stmt) =>
      omitDeep(stmt as object, [
        // Only in new parser
        "codeComment",
        "codeComments",
      ])
    ) as Stmt[])
      // Only in PEGJS parser
      .filter((stmt) => !("Comment" in stmt.stmt))
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

export default function parseAndFormat(
  sql: string,
  filename: string
): { formattedSql: string; ast: Stmt[] } {
  // 1. First we validate the syntax is correct with real parser
  // 2. Then we ensure our type matches the native ast with the decoder
  let realAst;
  try {
    realAst = nParse(sql, basename(filename));
  } catch (e) {
    console.error(e);
    // Lets see the parse error too.
    parse(sql, basename(filename), realAst);
    throw e;
  }

  // 3. Then we make sure our parser matches the output of the native parser
  const ast = parse(sql, basename(filename), realAst);

  const comments = parseComments(sql);

  const astNoComments = removeComments(ast);
  const actualAstNoComments = removeComments(realAst);
  for (const key in astNoComments) {
    const start = astNoComments[key].stmt_location ?? 0;
    const end = astNoComments[key].stmt_len ?? 99999;
    const rawSql = sql.substring(start, start + end);

    const nextToken = findNextToken(sql, start);
    const { line } = toLineAndColumn(sql, nextToken.start);

    assertNoDiff(
      actualAstNoComments[key],
      astNoComments[key],
      `AST does not match native parser, ${c.cyan(
        `${basename(filename)}:${line + 1}`
      )} (Statement ${Number(key) + 1} of ${
        astNoComments.length
      })${NEWLINE}${NEWLINE} ${c.bgRed(rawSql.trim())}`
    );
  }

  // It is easy to forget a comment in our parser, this ensures no comment fall through cracks.
  assertNoDiff(
    comments.split(/\s/).slice(0).sort().filter(Boolean), // <-- direct comment parser
    concatAllCodeComments(ast).slice(0).sort().filter(Boolean), // <--- pull comments from AST.
    `Parser is not retaining comments in ${c.cyan(
      `${basename(filename)}`
    )}\n${JSON.stringify(ast, null, 2)}`
  );

  // 4. Then we verify our formatter by confirmating it produces the same parsed AST
  const astNoStyle = removeStyle(ast);
  const formattedSql = format(ast, { sql, filename: basename(filename) });

  let formattedAst;
  try {
    formattedAst = parse(formattedSql, basename(filename));
  } catch (_e) {
    const e = _e as Error;
    console.log(formattedSql);
    e.name = `Format provided invalid SQL`;
    throw e;
  }

  const formattedAstNoStyle = removeStyle(formattedAst);

  for (const key in astNoStyle) {
    const startAst = ast[key].stmt_location ?? 0;
    const endAst = ast[key].stmt_len ?? 99999;
    const originalSql = sql.substring(startAst, startAst + endAst);

    const nextToken = findNextToken(sql, startAst);
    const { line } = toLineAndColumn(sql, nextToken.start);

    const startFormattedAst = formattedAst[key].stmt_location ?? 0;
    const endFormattedAst = formattedAst[key].stmt_len ?? 99999;
    const formattedSqlStmt = formattedSql.substring(
      startFormattedAst,
      startFormattedAst + endFormattedAst
    );

    assertNoDiff(
      astNoStyle[key],
      formattedAstNoStyle[key],
      `Formatter does not produce the same AST, ${c.cyan(
        `${basename(filename)}:${line + 1}`
      )} (Statement ${Number(key) + 1} of ${
        astNoComments.length
      })${NEWLINE}${NEWLINE}Correct:${NEWLINE}${c.yellow(
        originalSql.trim()
      )}${NEWLINE}${NEWLINE}Formatter:${NEWLINE}${c.yellow(
        formattedSqlStmt.trim()
      )}`
    );

    // Lets make sure the formatter prints all comments
    assertNoDiff(
      concatAllCodeComments(ast[key]).slice().sort(),
      concatAllCodeComments(formattedAst[key]).slice().sort(),
      `Formatter does not retain the same comments, ${c.cyan(
        `${basename(filename)}:${line + 1}`
      )} (Statement ${Number(key) + 1} of ${
        astNoComments.length
      })${NEWLINE}${NEWLINE}Correct:${NEWLINE}${c.yellow(
        originalSql.trim()
      )}${NEWLINE}${NEWLINE}Formatter:${NEWLINE}${c.yellow(
        formattedSqlStmt.trim()
      )}`
    );
  }

  return { ast, formattedSql };
}

/**
 * If a file is provided then lets just verify that file.
 */
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
    parseAndFormat(readFileSync(file).toString(), file);
  }
} else {
  /**
   * Lets grab all the files in the tests directory.
   */
  const files: { [s: string]: string } = readdirSync(
    join(__dirname, "../../fixtures/parseAndFormat")
  ).reduce((acc, file) => {
    if (!file.match(/\.sql$/)) {
      return acc;
    }
    return {
      ...acc,
      [file]: readFileSync(
        join(__dirname, "../../fixtures/parseAndFormat", file)
      ).toString(),
    };
  }, {});

  for (const file in files) {
    const statementName = file
      .replace(/\..*$/gi, "")
      .replace(/^[0-9]+\-/gi, "");
    const sql = files[file];

    // console.log(JSON.stringify(parse(sql), null, 2), format(parse(sql)));
    const { formattedSql, ast } = parseAndFormat(sql, file);

    // Lets create a snapshot
    writeFileSync(
      join(
        __dirname,
        "../../fixtures/parseAndFormat/__snapshots__",
        file.replace(/\.sql/, "-snapshot.sql")
      ),
      `${formattedSql}`
    );

    // 3. Make sure the filename should match the statement type.
    const unexpectedStatement = ast.find(
      (s: Stmt) =>
        Object.keys(s.stmt)[0].toLowerCase() !== statementName.toLowerCase() &&
        Object.keys(s.stmt)[0].toLowerCase() !== "comment"
    );
    if (unexpectedStatement) {
      const start = unexpectedStatement.stmt_location ?? 0;
      const end = unexpectedStatement.stmt_len ?? 99999;
      const rawSql = sql.substring(start, start + end);
      throw new Error(
        `${c.red(file)}: Expected "${statementName}", but got "${
          Object.keys(unexpectedStatement.stmt)[0]
        }"${NEWLINE}${NEWLINE}${c.blue(rawSql)}`
      );
    }
  }
}
