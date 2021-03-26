import { json as assertNoDiff } from "assert-no-diff";
import c from "ansi-colors";
import parse from "../parse";
import nParse from "../nativeParse";
import { join, basename } from "path";
import { lstatSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { NEWLINE } from "../format/whitespace";
import { FailResult } from "../parse/util";
import { getFriendlyErrorMessage, findNextToken } from "../parse/error";

import getRemoveAnsiRegx from "ansi-regex";

export default function errorAndAutocomplete(
  sql: string,
  filename: string
): void {
  const matches = sql.split(/-- @error-statement (.*)/);

  let previousCharLength = matches[0].length + 1;

  const brokenStatements = matches
    .slice(1)
    .reduce(
      (acc, str, index) => (index % 2 ? [...acc, str] : acc),
      [] as string[]
    );

  if (brokenStatements.length === 0) {
    throw new Error("No Assertions... add @error-statement lines");
  }

  const assertions = matches.reduce((acc, str, index) => {
    if (index % 2) {
      let payload;
      try {
        payload = JSON.parse(str);
      } catch (e) {
        throw new Error(`Unable to parse Assertion: ${c.cyan(str)}`);
      }
      return [...acc, payload];
    }

    return acc;
  }, [] as any[]);

  let snapshotTxt = "";

  for (const index in brokenStatements) {
    const brokenStatementSql = brokenStatements[index];
    const assertion = assertions[index];

    /**
     * Lets first ensure there is a native error
     */
    let nativeError: Error | null = null;
    try {
      nParse(brokenStatementSql, filename);
    } catch (e) {
      nativeError = e;
    }
    if (!nativeError) {
      throw new Error(
        `No native error thrown${NEWLINE}${NEWLINE}${c.cyan(
          brokenStatementSql.trim()
        )}${NEWLINE}`
      );
    }

    /**
     * Lets get the parse error.
     */
    let error: (Error & { result: FailResult }) | null = null;
    try {
      parse(brokenStatementSql, filename);
    } catch (e) {
      error = e;
    }
    if (!error) {
      throw new Error(
        `No error thrown${NEWLINE}${NEWLINE}${c.cyan(
          brokenStatementSql.trim()
        )}${NEWLINE}`
      );
    }

    const tokenPosition = findNextToken(brokenStatementSql, error.result.pos);
    const token = brokenStatementSql.substring(
      tokenPosition.start,
      tokenPosition.end
    );

    /**
     * Lets confirm our error is what we expect
     */
    const expected = error.result.expected
      .map((e) => (e.type === "keyword" ? JSON.parse(e.value) : e.value))
      .sort();

    // Lets generate an appropiate friendly error message with the right line numbers.
    const offset = sql.indexOf(brokenStatementSql);
    const errorMessage = getFriendlyErrorMessage({
      filename,
      str: sql,
      result: {
        ...error.result,
        expected: [
          // Replace the first expected field with one with the correct position.
          { ...error.result.expected[0], pos: offset + error.result.pos },
          ...error.result.expected.slice(1),
        ],
        // Replace it here too.
        pos: offset + error.result.pos,
      },
    });

    assertNoDiff(
      assertion,
      {
        expected,
        token,
      },
      `${c.red(
        "Expected different error"
      )}${NEWLINE}${NEWLINE}${errorMessage}${NEWLINE}${NEWLINE}Expected: ${c.blue(
        JSON.stringify(expected)
      )}`
    );

    previousCharLength += brokenStatementSql.length;

    snapshotTxt += `${errorMessage}${NEWLINE}`;
  }

  writeFileSync(
    join(
      __dirname,
      "../../fixtures/errorAndAutocomplete/__snapshots__",
      filename.replace(/\.sql/, "-snapshot.sql")
    ),
    snapshotTxt
      .replace(getRemoveAnsiRegx(), "")
      .replace(/-- @error-statement (.*)/g, "")
  );
}

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
    errorAndAutocomplete(readFileSync(file).toString(), basename(file));
  }
} else {
  const files: string[] = readdirSync(
    join(__dirname, "../../fixtures/errorAndAutocomplete")
  ).reduce((acc: string[], file: string) => {
    if (!file.match(/\.sql$/)) {
      return acc;
    }
    return [
      ...acc,
      join(__dirname, "../../fixtures/errorAndAutocomplete", file),
    ];
  }, []);

  for (const file of files) {
    errorAndAutocomplete(readFileSync(file).toString(), basename(file));
  }
}
