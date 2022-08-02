import { Stmt } from "../types";
import {
  transform,
  sequence,
  zeroToMany,
  whitespace,
  sqlStyleComment,
  cStyleComment,
  or,
  ResultType,
  Rule,
  combineComments,
  endOfInput,
  SuccessResult,
} from "./util";
import { getFriendlyErrorMessage } from "./error";
import { variableSetStmt } from "./variableSetStmt";
import { createEnumStmt } from "./createEnumStmt";
import { createSeqStmt } from "./createSeqStmt";
import { alterSeqStmt } from "./alterSeqStmt";
import { createStmt } from "./createStmt";
import { dropStmt } from "./dropStmt";
import { alterEnumStmt } from "./alterEnumStmt";
import { alterOwnerStmt } from "./alterOwnerStmt";
import { indexStmt } from "./indexStmt";
import { alterTableStmt } from "./alterTableStmt";
import { selectStmt } from "./selectStmt";
import { viewStmt } from "./viewStmt";
import { codeComments } from "./codeComments";
import { renameStmt } from "./renameStmt";
import { updateStmt } from "./updateStmt";
import { transactionStmt } from "./transactionStmt";
import { alterDatabaseSetStmt } from "./alterDatabaseSetStmt";
import { alterDatabaseStmt } from "./alterDatabaseStmt";

class ParseError extends Error {}

const CommentStatement = transform(
  sequence([
    zeroToMany(whitespace),
    or([cStyleComment, sqlStyleComment]),
    zeroToMany(whitespace),
  ]),
  (v) => {
    return { value: { Comment: v[1] }, eos: null };
  }
);

export const stmt = transform(
  or([
    or([
      variableSetStmt,
      createEnumStmt,
      createSeqStmt,
      alterSeqStmt,
      createStmt,
      dropStmt,
      alterEnumStmt,
      alterOwnerStmt,
      indexStmt,
      alterTableStmt,
    ]),
    selectStmt,
    viewStmt,
    renameStmt,
    updateStmt,
    transactionStmt,
    alterDatabaseSetStmt,
    alterDatabaseStmt,

    // Standalone comments
    CommentStatement,
  ]),
  (v, ctx, r) => {
    if (!ctx.numStatements) {
      ctx.numStatements = 1;
    } else {
      ctx.numStatements++;
    }
    // console.log(r.tokens);
    return { ...v, tokens: r.tokens };
  }
);

export const stmts: Rule<Stmt[]> = transform(
  sequence([
    zeroToMany(stmt),
    endOfInput, // <-- This ensures we don't return before hitting the end of our SQL.
  ]),
  (v) => {
    const stmts = v[0];

    const output: Stmt[] = [];

    let previousStmtLocation = 0;
    for (let i = 0; i < stmts.length; i++) {
      const c = stmts[i];

      output.push({
        stmt: c.value,
        ...(c.eos?.firstSemicolonPos
          ? {
              stmt_len: c.eos.firstSemicolonPos - previousStmtLocation,
            }
          : {}),
        ...(previousStmtLocation
          ? { stmt_location: previousStmtLocation }
          : {}),
        tokens: c.tokens,
      });

      if (c.eos?.lastSemicolonPos != null) {
        previousStmtLocation = c.eos.lastSemicolonPos + 1;
      }
    }

    return output;
  }
);

function reduceComments(acc: Stmt[], stmt: Stmt): Stmt[] {
  const previousStmt = acc[acc.length - 1];

  // combine comment nodes and remove whitespace.
  if (
    previousStmt &&
    "Comment" in previousStmt.stmt &&
    "Comment" in stmt.stmt
  ) {
    return [
      ...acc.slice(0, -1),
      {
        stmt: {
          Comment: combineComments(
            previousStmt.stmt.Comment,
            stmt.stmt.Comment
          ),
        },
      },
    ];
    // Just lead whitespace
  } else if ("Comment" in stmt.stmt) {
    return [
      ...acc,
      {
        stmt: {
          Comment: stmt.stmt.Comment,
        },
      },
    ];
  } else {
    return acc.concat(stmt);
  }
}

/**
 * Used mostly of validation of parse method
 */
export function parseComments(inputSql: string) {
  const result = codeComments({
    str: inputSql,
    pos: 0,
    numStatements: 0,
  });

  if (result.type == ResultType.Success) {
    return result.value;
  }

  throw new Error("sql brokenz");
}

/**
 * Human-friendly version of the raw generated parser's parse() function, but
 * with much better error reporting, showing source line position where it
 * failed.
 */
export default function parse(
  sql: string,
  filename = "unknown",
  opts?: {
    /**
     * When printing errors, should we use colors ?
     */
    colors?: boolean | undefined;
  }
): SuccessResult<Stmt[]> {
  const context = { str: sql, pos: 0, numStatements: 0 };
  const result = stmts(context);

  if (result.type == ResultType.Success) {
    result.value = result.value.reduce(reduceComments, []);
    return result;
  }

  const errorMessage = getFriendlyErrorMessage(result, {
    ...opts,
    colors: true, // <-- By default errors will use ANSI colors
    sql,
    filename,
  });

  const error = new ParseError(errorMessage);

  throw error;
}
