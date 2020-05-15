import { optional, mixed, array, string, guard, exact } from "decoders";
import pgParse from "./pgParse";
import { queryDecoder, QueryWithText } from "./query";
import toOriginalText from "./toOriginalText";
import { PGError, PGErrorCode } from "../errors";

export * from "./alterTableStmt";
export * from "./boolExpr";
export * from "./columnRef";
export * from "./constant";
export * from "./constraint";
// export * from "./createEnumStmt";
export * from "./createStmt";
export * from "./fromClause";
export * from "./funcCall";
export * from "./joinExpr";
export * from "./index";
export * from "./pgParse";
export * from "./query";
export * from "./selectStmt";
export * from "./targetValue";
export * from "./toOriginalText";
export * from "./typeCast";

export const parserResultDecoder = exact({
  // This is mixed because Error messages are hard to read if we do this here, we validate each query seperately
  query: array(mixed),
  stderr: optional(string),
  error: optional(mixed),
});

export const validateParsedResult = guard(parserResultDecoder);

export const validateQuery = guard(queryDecoder);

export type Parser = Iterator<QueryWithText, void>;

export default function* toParser(sqlIterator: Iterator<string, void>): Parser {
  let curr = sqlIterator.next();

  while (!curr.done) {
    const sql = curr.value;
    const unsafeResult = pgParse(sql);
    const { query: queries, stderr, error } = validateParsedResult(
      unsafeResult
    );

    if (stderr || error) {
      if (error) {
        throw new PGError(PGErrorCode.INVALID, `${sql}\n\n${String(error)}`);
      } else {
        throw new PGError(PGErrorCode.INVALID, stderr || "");
      }
    }

    for (const index in queries) {
      const unSafeQuery = queries[index];
      const text = toOriginalText(sql, Number(index));

      yield {
        query: validateQuery(unSafeQuery),
        text,
      };
    }

    curr = sqlIterator.next();
  }
}
