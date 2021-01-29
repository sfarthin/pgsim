import { Stmt } from "../src/types";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

import verify from "../src/verifySql";

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

describe("Parse and format", () => {
  for (const file in files) {
    // if (file === "createSeqStmt.sql") {
    it(file, () => {
      const statementName = file.replace(/\..*$/gi, "");
      const sql = files[file];
      const { formattedSql, ast } = verify(sql, file);

      // 3. Make sure the filename should match the statement type.
      const unexpectedStatement = ast.find(
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

      expect(formattedSql).toMatchSnapshot();
    });
    // }
  }
});
