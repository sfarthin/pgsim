import * as d from "decoders";
import { stmtDecoder, Stmt } from "~/types";
import { parseQuerySync } from "libpg-query";
import { toLineAndColumn } from "../format/print";
import { NEWLINE } from "../format/print";

export const parserResultDecoder = d.exact({
  version: d.number,
  // This is unknown because Error messages are hard to read if we do this here, we validate each query seperately
  stmts: d.array(d.unknown),
});

export default function parse(sql: string, filename: string): Stmt[] {
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
