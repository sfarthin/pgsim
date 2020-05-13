import { optional, mixed, array, string, guard, exact, object } from "decoders";
import pgParse from "./pgParse";
import { queryDecoder, QueryWithText } from "./query";
import toOriginalText from "./toOriginalText";
import { SelectStmt } from "./selectStmt";
import { PGError, PGErrorCode } from "../errors";

export * from "./selectStmt";
export * from "./alterTableStmt";
export * from "./createStmt";
export * from "./constraint";
export * from "./query";
export * from "./constant";

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

      try {
        yield {
          query: validateQuery(unSafeQuery),
          text,
        };
      } catch (e) {
        throw new PGError(
          PGErrorCode.NOT_UNDERSTOOD,
          `Unable to understand query ${`\n\n${text}\n\n`} ${e.message}`
        );
      }
    }

    curr = sqlIterator.next();
  }
}

// export function parseSelect(str: string): SelectStmt {
//   const queries = parse(str);

//   if (queries.length !== 1 || !("SelectStmt" in queries[0].query)) {
//     throw new PGError(PGErrorCode.INVALID, "Expected a single SELECT");
//   }

//   return queries[0].query.SelectStmt;
// }
