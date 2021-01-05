import { Stmt } from "~/types";
// import { parse as rawParseSql } from "./language";

// const indent = (
//   text: string,
//   prefixNumeralLength?: number,
//   startLine?: number,
//   line?: number,
//   startColumn?: number,
//   endColumn?: number
// ): string => {
//   const printLine = (i: number): string => {
//     if (!startLine || !prefixNumeralLength || startLine + i < 0) {
//       return [...new Array(prefixNumeralLength)].map(() => " ").join("");
//     }

//     const prefixSpaces = [
//       ...new Array(prefixNumeralLength - (startLine + i).toString().length),
//     ]
//       .map(() => " ")
//       .join("");

//     return `\u001b[34m${prefixSpaces}${startLine + i}\u001b[0m`;
//   };

//   return text
//     .split("\n")
//     .map((s, i) => {
//       if (
//         startLine &&
//         startColumn &&
//         endColumn &&
//         line &&
//         line === startLine + i
//       ) {
//         return (
//           printLine(i) +
//           "    " +
//           s.substring(0, startColumn - 1) +
//           "\u001b[31m" +
//           s.substring(startColumn - 1, endColumn - 1) +
//           "\u001b[0m" +
//           s.substring(endColumn - 1)
//         );
//       }
//       return `${printLine(i)}    ${s}`;
//     })
//     .join("\n");
// };

// const NUM_CONTEXT_LINES_BEFORE = 4;
// const NUM_CONTEXT_LINES_AFTER = 3;

// type Expected =
//   | { type: "other"; description: string }
//   | { type: "literal"; text: string; ignoreCase: boolean };

// type PossiblePegJSError = Error & {
//   location?: {
//     start: { line: number; column: number; offset: number };
//     end: { line: number; column: number; offset: number };
//   };
//   expected?: Expected[];
//   found?: string;
//   filename?: string;
// };

// /**
//  * Prints parser errors nicely
//  */
// const getFriendlyErrorMessage = (
//   filename: string,
//   input: string,
//   e: PossiblePegJSError
// ): string => {
//   const loc = e.location;
//   if (!loc) {
//     // Likely not a parser error
//     return e.message;
//   }

//   const lines = input.split("\n");
//   const { start, end } = loc;
//   const before = lines.slice(
//     start.line - 1 - NUM_CONTEXT_LINES_BEFORE,
//     start.line - 1
//   );
//   const line = lines[start.line - 1];
//   const after = lines.slice(start.line, start.line + NUM_CONTEXT_LINES_AFTER);
//   const prefixNumeralLength = start.line.toString().length + 1;
//   let error = "";
//   error += `Parse error${filename ? ` in ${filename}` : ""}: ${e.message}\n`;
//   error += "\n";
//   error +=
//     indent(
//       before.join("\n"),
//       prefixNumeralLength,
//       start.line - NUM_CONTEXT_LINES_BEFORE
//     ) + "\n";
//   error +=
//     indent(
//       line,
//       prefixNumeralLength,
//       start.line,
//       start.line,
//       start.column,
//       end.column
//     ) + "\n";
//   // error +=
//   //   indent(
//   //     " ".repeat(offset - 1) +
//   //       "\u001b[31m" +
//   //       "^".repeat(end.line !== start.line ? 1 : end.column - start.column) +
//   //       "\u001b[0m",
//   //     prefixNumeralLength
//   //   ) + "\n";
//   error += indent(after.join("\n"), prefixNumeralLength, start.line + 1) + "\n";
//   error += "\n";

//   return error;
// };

import {
  transform,
  sequence,
  oneToMany,
  endOfInput,
  zeroToMany,
  whitespace,
  sqlStyleComment,
  cStyleComment,
  or,
  ResultType,
  Rule,
  Context,
} from "./util";
import { variableSetStmt } from "./variableSetStmt";
import { createEnumStmt } from "./createEnumStmt";

const stmts: Rule<Stmt[]> = transform(
  sequence([
    oneToMany(
      transform(
        or([
          transform(variableSetStmt, (v) => ({ VariableSetStmt: v })),
          transform(createEnumStmt, (v) => ({ CreateEnumStmt: v })),

          // Standalone comments
          transform(
            sequence([
              zeroToMany(whitespace),
              or([cStyleComment, sqlStyleComment]),
              zeroToMany(whitespace),
            ]),
            (v) => ({ Comment: v[1] })
          ),
        ]),
        (stmt, context) => {
          // HACK, we are mutating this context as we parse
          const eos = context.endOfStatement
            // remove missing and duplicate entries
            .filter((v, i) => v && context.endOfStatement.indexOf(v) === i)
            // sort so we are always pulling the latest information
            .sort((a, b) => a - b);

          const stmt_location = eos.length <= 1 ? 0 : eos[eos.length - 2] + 1;
          const stmt_len = eos[eos.length - 1] - stmt_location;

          return {
            RawStmt: {
              stmt,
              stmt_len,
              ...(stmt_location === 0 ? {} : { stmt_location }),
            },
          };
        }
      )
    ),
    endOfInput,
  ]),
  (v) => v[0]
);

/**
 * Human-friendly version of the raw generated parser's parse() function, but
 * with much better error reporting, showing source line position where it
 * failed.
 */
export default function parse(inputSql: string, filename = ""): Stmt[] {
  const context: Context = {
    endOfStatement: [],
    str: inputSql,
    pos: 0,
  };

  const result = stmts(context);

  if (result.type == ResultType.Success) {
    return result.value;
  }

  throw new Error();

  // try {
  //   // We lean on our unit tests to be have confidence the output type
  //   // here matches our TS types.
  //   return rawParseSql(inputSql);
  // } catch (e) {
  //   e.filename = filename;
  //   e.message = getFriendlyErrorMessage(filename, inputSql, e);
  //   throw e;
  // }
}
