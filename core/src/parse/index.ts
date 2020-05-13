import { optional, mixed, array, string, guard, exact } from "decoders";
import pgParse from "./pgParse";
import { queryDecoder, Queries } from "./query";
import toOriginalText from "../toReader/toOriginalText";
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

const getLocationFromUnSafeQuery = (q: any) => {
  // @ts-ignore - with the conditional chaining this is harmless, byt typescript is concerned
  return Object.values(q)?.[0]?.relation?.RangeVar?.location ?? null;
};

export default function parse(sql: string): Queries {
  const unsafeResult = pgParse(sql);
  const { query: queries, stderr, error } = validateParsedResult(unsafeResult);

  // Native error
  if (stderr || error) {
    throw error || new Error(stderr);
  }

  let index = 0;
  try {
    return queries.map((unSafeQuery: any, i) => {
      index = i;
      return validateQuery(unSafeQuery);
    });
  } catch (e) {
    try {
      const queryAsText = toOriginalText(sql, index);
      e.message = `Unable to understand query ${`\n\n${queryAsText}\n\n`} ${
        e.message
      }`;
    } catch (e) {
      e.message = `Unable to understand query ${index + 1} ${e.message}`;
    }
    throw e;
  }
}

export function parseSelect(str: string): SelectStmt {
  const queries = parse(str);

  if (queries.length !== 1 || !("SelectStmt" in queries[0])) {
    throw new PGError(PGErrorCode.NOT_EXISTS, "Expected a single SELECT");
  }

  return queries[0].SelectStmt;
}
