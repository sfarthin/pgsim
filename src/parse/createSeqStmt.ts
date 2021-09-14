import {
  transform,
  CREATE,
  SEQUENCE,
  identifier,
  Rule,
  endOfStatement,
  optional,
  ifNotExists,
  combineComments,
  sequence,
  _,
  __,
} from "./util";
import { CreateSeqStmt, RangeVar } from "../types";
import { defElemList } from "./defElem";

export const createSeqStmt: Rule<CreateSeqStmt> = transform(
  sequence([
    _,
    CREATE,
    __,
    SEQUENCE,
    __,
    optional(ifNotExists), // 5
    __,
    transform(identifier, (v, ctx) => ({
      relname: v,
      relpersistence: "p" as const,
      inh: true,
      location: ctx.pos,
    })),
    __,
    optional(defElemList), // 9
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      sequence: v[7],
      ...(v[9]?.length
        ? {
            options: v[9],
          }
        : {}),
      ...(v[5] !== null ? { if_not_exists: true } : {}),
      codeComment: combineComments(v[0], v[2], v[4], v[6], v[8], v[10], v[11]),
    };
  }
);
