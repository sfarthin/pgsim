import { Stmt } from "~/types";
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
  combineComments,
} from "./util";
import { getFriendlyErrorMessage } from "./error";
import { variableSetStmt } from "./variableSetStmt";
import { createEnumStmt } from "./createEnumStmt";
import { createSeqStmt } from "./createSeqStmt";
import { alterSeqStmt } from "./alterSeqStmt";
import { createStmt } from "./createStmt";

const CommentStatement = transform(
  sequence([
    zeroToMany(whitespace),
    or([cStyleComment, sqlStyleComment]),
    zeroToMany(whitespace),
  ]),
  (v) => {
    // ctx.endOfStatement[ctx.endOfStatement.length - 1] = ctx.pos;
    // ctx.startOfNextStatement[ctx.endOfStatement.length - 1] = ctx.pos;

    return { Comment: v[1] };
  }
);

const stmts: Rule<Stmt[]> = transform(
  sequence([
    oneToMany(
      transform(
        or([
          transform(variableSetStmt, (v) => ({ VariableSetStmt: v })),
          transform(createEnumStmt, (v) => ({ CreateEnumStmt: v })),
          transform(createSeqStmt, (v) => ({ CreateSeqStmt: v })),
          transform(alterSeqStmt, (v) => ({ AlterSeqStmt: v })),
          transform(createStmt, (v) => ({ CreateStmt: v })),

          // Standalone comments
          CommentStatement,
        ]),
        (stmt, context) => {
          // HACK, we are mutating this context as we parse
          // This gets a little tricky when there are extra semicolons

          const eos = context.endOfStatement
            // remove missing and duplicate entries
            .filter((v, i) => v && context.endOfStatement.indexOf(v) === i)
            // sort so we are always pulling the latest information
            .sort((a, b) => a - b);

          const sons = context.startOfNextStatement
            // remove missing and duplicate entries
            .filter(
              (v, i) => v && context.startOfNextStatement.indexOf(v) === i
            )
            // sort so we are always pulling the latest information
            .sort((a, b) => a - b);

          const stmt_location =
            sons.length <= 1 ? 0 : sons[sons.length - 2] + 1;

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

function reduceComments(acc: Stmt[], stmt: Stmt): Stmt[] {
  const previousStmt = acc[acc.length - 1];
  // combine comment nodes
  if (
    previousStmt &&
    "Comment" in previousStmt.RawStmt.stmt &&
    "Comment" in stmt.RawStmt.stmt
  ) {
    return [
      ...acc.slice(0, -1),
      {
        RawStmt: {
          stmt: {
            Comment: combineComments(
              previousStmt.RawStmt.stmt.Comment,
              stmt.RawStmt.stmt.Comment
            ),
          },
        },
      },
    ];
  } else {
    return acc.concat(stmt);
  }
}

/**
 * Human-friendly version of the raw generated parser's parse() function, but
 * with much better error reporting, showing source line position where it
 * failed.
 */
export default function parse(inputSql: string, filename = ""): Stmt[] {
  const context: Context = {
    endOfStatement: [],
    startOfNextStatement: [],
    str: inputSql,
    pos: 0,
  };

  const result = stmts(context);

  if (result.type == ResultType.Success) {
    return result.value.reduce(reduceComments, []);
  }

  throw new Error(getFriendlyErrorMessage(filename, context.str, result));
}
