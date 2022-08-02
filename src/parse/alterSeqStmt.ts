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
  EOS,
} from "./util";
import { AlterSeqStmt } from "~/types";
import { defElemList } from "./defElem";

export const alterSeqStmt: Rule<{
  eos: EOS;
  value: { AlterSeqStmt: AlterSeqStmt };
}> = transform(
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
      eos: v[9],
      value: {
        AlterSeqStmt: {
          sequence: v[5],
          ...(v[7].length ? { options: v[7] } : {}),
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[9].comment
          ),
        },
      },
    };
  }
);
