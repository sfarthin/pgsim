import { optional, array, string, guard, exact, unknown } from "decoders";
import pgParse from "./pgParse";
import { stmtDecoder, Stmt } from "./ast";
import { PGError, PGErrorCode } from "../errors";

export * from "./alterTableStmt";
export * from "./boolExpr";
export * from "./columnRef";
export * from "./constant";
export * from "./constraint";
// export * from "./createEnumStmt";
export * from "./createStmt";
export * from "./createSeqStmt";
export * from "./fromClause";
export * from "./funcCall";
export * from "./joinExpr";
export * from "./index";
export * from "./pgParse";
export * from "./ast";
export * from "./selectStmt";
export * from "./targetValue";
export * from "./toOriginalText";
export * from "./typeCast";

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

  return queries.map(guard(stmtDecoder));
}
