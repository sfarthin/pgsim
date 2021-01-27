import { optional, array, string, guard, exact, unknown } from "decoders";
import { stmtDecoder, Stmt } from "~/types";
// @ts-expect-error - No declaration
import { parse as pgParse } from "pg-query-native-latest";

export const parserResultDecoder = exact({
  // This is unknown because Error messages are hard to read if we do this here, we validate each query seperately
  query: array(unknown),
  stderr: optional(string),
  error: optional(unknown),
});

export default function parse(sql: string): Stmt[] {
  const unsafeResult = pgParse(sql);
  const { query: queries, stderr, error } = guard(parserResultDecoder)(
    unsafeResult
  );

  if (stderr || error) {
    if (error) {
      throw new Error(`${sql}\n\n${String(error)}`);
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
      e.message = `Error decoding AST -- ${e.message}\n\n${JSON.stringify(
        s,
        null,
        2
      )}\n\n${originalSql}`;
      throw e;
    }
  });
}
