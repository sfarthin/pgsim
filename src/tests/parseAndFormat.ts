import parse, { parseComments, ParseError } from "../parse";
import { SuccessResult } from "../parse/util";
import * as d from "decoders";
import { stmtDecoder, Stmt } from "~/types";
import { parseQuerySync } from "libpg-query";
import { toLineAndColumn, NEWLINE } from "../format/print";
import format, { toString } from "../format";
import { join, basename } from "path";
import { lstatSync, readdirSync, readFileSync, writeFileSync } from "fs";
import {
  json as assertNoDiff,
  wordsWithSpace as assertStr,
} from "assert-no-diff";
import c from "ansi-colors";

Error.stackTraceLimit = Infinity;

const parserResultDecoder = d.exact({
  version: d.number,
  // This is unknown because Error messages are hard to read if we do this here, we validate each query seperately
  stmts: d.array(d.unknown),
});

function nParse(sql: string, filename: string): Stmt[] {
  const unsafeResult = parseQuerySync(sql);
  const { stmts } = d.guard(parserResultDecoder)(unsafeResult);

  return stmts.map((s: any) => {
    try {
      return d.guard(stmtDecoder)(s);
    } catch (_e) {
      const e = _e as { message: string };
      const startAst = s.stmt_location ?? 0;
      const endAst = s.stmt_len ?? 99999;
      const originalSql = sql.substring(startAst, startAst + endAst);
      const { line, column } = toLineAndColumn(sql, startAst);
      e.message = `Error decoding AST in ${filename}(${line + 1}, ${
        column + 1
      }) -- ${e.message}${NEWLINE}${NEWLINE}${JSON.stringify(
        s,
        null,
        2
      )}${NEWLINE}${NEWLINE}${originalSql}`;
      throw e;
    }
  });
}

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
    (
      stmts.map((stmt) =>
        omitDeep(stmt as object, [
          // Only in new parser
          "codeComment",
          "codeComments",
          "tokens",
        ])
      ) as Stmt[]
    )
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

      // only in our parser
      "tokens",
    ])
  ) as Stmt[];
}

export default function parseAndFormat(
  sql: string,
  filename: string
): { formattedSql: string; ast: SuccessResult<Stmt[]> } {
  // 1. Make sure our parser and native parser can parse correctly
  let realAst;
  try {
    realAst = nParse(sql, basename(filename));
  } catch (e) {
    // Lets see the parse error too.
    try {
      const ast = parse(sql, basename(filename));
      console.log(JSON.stringify(ast, null, 2));
    } catch (errorWithOurParser) {
      // If both our parser and the native parser fail, its probably inncorrect syntax.
      console.error(e);
      throw errorWithOurParser;
    }

    console.log(
      `${c.red(
        "\nOur parser finished successfully, but the native parser errored out"
      )}: ${c.green(basename(filename))}\n`
    );
    throw e;
  }

  let ast;
  try {
    ast = parse(sql, basename(filename), { includeTokens: true });
  } catch (e) {
    if (e instanceof ParseError) {
      console.log(JSON.stringify(realAst[e.statementNum].stmt, null, 2));
    }

    throw e;
  }

  assertStr(
    toString(ast.tokens, {
      colors: false,
      lineNumbers: false,
    }),
    sql,
    `2. The parsed tokens do not match the original SQL input`
  );

  const comments = parseComments(sql);

  const astNoComments = removeComments(ast.value);
  if (realAst) {
    const actualAstNoComments = removeComments(realAst);

    for (const key in astNoComments) {
      const start = astNoComments[key].stmt_location ?? 0;
      const end = astNoComments[key].stmt_len ?? 99999;
      const rawSql = sql.substring(start, start + end);

      const { line } = toLineAndColumn(
        sql,
        astNoComments[key].stmt_location ?? 0
      );

      assertNoDiff(
        actualAstNoComments[key],
        astNoComments[key],
        `3. AST does not match native parser, ${c.cyan(
          `${basename(filename)}:${line + 1}`
        )} (Statement ${Number(key) + 1} of ${
          astNoComments.length
        })${NEWLINE}${NEWLINE} ${c.bgRed(rawSql.trim())}\n\n${c.red(
          "Red"
        )} is the AST result of our parser and ${c.green(
          "green"
        )} is the result of the native parser (aka the result we want)`
      );
    }
  }

  // It is easy to forget a comment in our parser, this ensures no comment fall through cracks.
  assertNoDiff(
    comments.split(/\s/).slice(0).sort().filter(Boolean), // <-- direct comment parser
    concatAllCodeComments(ast).slice(0).sort().filter(Boolean), // <--- pull comments from AST.
    `4. Parser is not retaining comments in ${c.cyan(
      `${basename(filename)}`
    )}\n${JSON.stringify(removeStyle(ast.value), null, 2)}`
  );

  // 5. Then we verify our formatter by confirming it produces the same parsed AST
  const astNoStyle = removeStyle(ast.value);
  const formattedSql = format(ast, basename(filename), { sql });

  let formattedAst;
  try {
    formattedAst = parse(formattedSql, basename(filename), {
      includeTokens: true,
    });
  } catch (_e) {
    const e = _e as Error;
    e.name = `Format provided invalid SQL`;
    throw e;
  }

  assertStr(
    toString(formattedAst.tokens, {
      colors: false,
      lineNumbers: false,
    }),
    formattedSql,
    `5. Our parsed tokens match our formatted SQL`
  );

  const formattedAstNoStyle = removeStyle(formattedAst.value);

  for (const key in astNoStyle) {
    const startAst = ast.value[key].stmt_location ?? 0;
    const endAst = ast.value[key].stmt_len ?? 99999;
    const originalSql = sql.substring(startAst, startAst + endAst);

    const { line, column } = toLineAndColumn(sql, startAst);

    const startFormattedAst = formattedAst.value[key].stmt_location ?? 0;
    const endFormattedAst = formattedAst.value[key].stmt_len ?? 99999;
    const formattedSqlStmt = formattedSql.substring(
      startFormattedAst,
      startFormattedAst + endFormattedAst
    );

    assertNoDiff(
      astNoStyle[key],
      formattedAstNoStyle[key],
      `6. Formatter does not produce the same AST, ${c.cyan(
        `${basename(filename)}(${line + 1}:${column + 1})`
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
      concatAllCodeComments(ast.value[key]).slice().sort(),
      concatAllCodeComments(formattedAst.value[key]).slice().sort(),
      `7. Formatter does not retain the same comments, ${c.cyan(
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
  const filepath = process.argv[2];

  let files;
  if (lstatSync(filepath).isDirectory()) {
    files = readdirSync(filepath)
      .filter((f) => f.match(/\.sql$/))
      .map((f) => join(process.argv[2], f));
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
    const unexpectedStatement = ast.value.find(
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
