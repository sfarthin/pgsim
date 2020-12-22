import { optional, array, string, guard, exact, unknown } from "decoders";
import { stmtDecoder, Stmt } from "~/types";
import { PGError, PGErrorCode } from "~/util/errors";
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
      throw new PGError(PGErrorCode.INVALID, `${sql}\n\n${String(error)}`);
    } else {
      throw new PGError(PGErrorCode.INVALID, stderr || "");
    }
  }

  try {
    return queries.map(guard(stmtDecoder));
  } catch (e) {
    console.log(JSON.stringify(e, null, 2));
    throw e;
  }
}