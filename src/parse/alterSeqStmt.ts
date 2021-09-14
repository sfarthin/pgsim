import {
  transform,
  ALTER,
  SEQUENCE,
  identifier,
  Rule,
  endOfStatement,
  combineComments,
  sequence,
  __,
  _,
  commentsOnSameLine,
} from "./util";
import { AlterSeqStmt, RangeVar } from "../types";
import { defElemList } from "./defElem";

export const alterSeqStmt: Rule<AlterSeqStmt> = transform(
  sequence([
    _,
    ALTER,
    __,
    SEQUENCE,
    __,
    transform(identifier, (v, ctx) => ({
      // 5
      relname: v,
      relpersistence: "p" as const,
      inh: true,
      location: ctx.pos,
    })),
    commentsOnSameLine,
    defElemList, // 7
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      sequence: v[5],
      ...(v[7].length ? { options: v[7] } : {}),
      codeComment: combineComments(v[0], v[2], v[4], v[6], v[8], v[9]),
    };
  }
);
