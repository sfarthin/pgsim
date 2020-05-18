import { string, compose, predicate, guard } from "decoders";
// @ts-expect-error - No declaration
import { format } from "sql-formatter";
import pgParse from "./pgParse";

const textQueryDecoder = compose(
  string,
  predicate((s) => s.length > 1, "Not a long enough query")
);

const verifyTextQuery = guard(textQueryDecoder);

export default function getTextFromQuery(
  sql: string,
  indexOfQuery: number
): string {
  const totalQueries: number = pgParse(sql).query.length;
  /**
   * The pg parser doesn't give us the SQL of the queries it fails to parse.
   * To handle that, we use this hack to pull the original SQL.
   */

  const parsedTextQueries = sql
    // Remove comments
    .replace(/\-\-.*/gi, "")
    .split(";")
    // Trim whitespace then remove any empty rows
    .map((s) => s.replace(/^\s+|\s+$/g, ""))
    .filter(Boolean)

    // Format it to look nice (i.e. consistant indention)
    .map((s) => format(verifyTextQuery(s)));

  if (
    totalQueries !== parsedTextQueries.length ||
    !parsedTextQueries[indexOfQuery]
  ) {
    return "";
  }

  return parsedTextQueries[indexOfQuery];
}
