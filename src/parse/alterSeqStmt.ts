import {
  transform,
  ALTER,
  SEQUENCE,
  identifier,
  Rule,
  endOfStatement,
  combineComments,
  sequence,
  zeroToMany,
  __,
  _,
  commentsOnSameLine,
} from "./util";
import { AlterSeqStmt, RangeVar } from "../types";
import { defElem } from "./defElem";

const defElemList = transform(zeroToMany(sequence([__, defElem])), (v) =>
  v.map((r) => ({
    DefElem: {
      ...r[1],
      codeComment: r[0],
    },
  }))
);

export const alterSeqStmt: Rule<AlterSeqStmt> = transform(
  sequence([
    _,
    ALTER,
    __,
    SEQUENCE,
    __,
    transform(identifier, (v, ctx) => ({
      // 5
      RangeVar: {
        relname: v,
        relpersistence: "p",
        inh: true,
        location: ctx.pos,
      },
    })) as Rule<{ RangeVar: RangeVar }>,
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
