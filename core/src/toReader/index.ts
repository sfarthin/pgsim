import parse, { Query, Schema } from "../parse";
import toOriginalText from "./toOriginalText";

export type QueryReader = Iterator<
  // TODO add comments.
  { query: Query; text: string },
  void
>;

export default function* toReader(
  text: string,
  existingSchema: Schema | void
): QueryReader {
  let queries = parse(text);

  for (let query of queries) {
    const index = queries.indexOf(query);
    const queryAsText = toOriginalText(text, index);

    yield { query, text: queryAsText };
  }
}

// try {
//   const index = queries.indexOf(query);
//   if ("CreateStmt" in query) {
//     lintErrors.push({
//       error: PGErrorCode.NO_ALTER_TABLE,
//       message: `Cannot mutate a table in a query: \n${toOriginalText(
//         sql,
//         index
//       )}`,
//     });
//   } else if ("SelectStmt" in query) {
//     const resultType = fromSelect(schema, query.SelectStmt);
//   }
// } catch (e) {
//   if (e.id) {
//     lintErrors.push({
//       error: e.id,
//       message: `${sql} \n\n^^^ ${e.message}`,
//     });
//   } else {
//     throw e;
//   }
// }
