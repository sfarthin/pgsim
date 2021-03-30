import { optional, array, string, guard, exact, unknown } from "decoders";
import { stmtDecoder, Stmt } from "../types";
// @ts-expect-error
import { parse as pgParse } from "pg-query-native-latest";
import { toLineAndColumn } from "../parse/error";
import { NEWLINE } from "../format/util";

export const parserResultDecoder = exact({
  // This is unknown because Error messages are hard to read if we do this here, we validate each query seperately
  query: array(unknown),
  stderr: optional(string),
  error: optional(unknown),
});

export default function parse(sql: string, filename: string): Stmt[] {
  const unsafeResult = pgParse(sql);
  const { query: queries, stderr, error } = guard(parserResultDecoder)(
    unsafeResult
  );

  if (stderr || error) {
    if (error) {
      throw new Error(
        `${sql}${NEWLINE}${NEWLINE}${filename}: ${String(error)}`
      );
    } else {
      throw new Error(stderr || "");
    }
  }

  return queries.map((s: any) => {
    try {
      return guard(stmtDecoder)(s);
    } catch (e) {
      const startAst = s.RawStmt.stmt_location ?? 0;
      const endAst = s.RawStmt.stmt_len ?? 99999;
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
