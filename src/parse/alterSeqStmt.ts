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
      eos: v[8],
      value: {
        AlterSeqStmt: {
          sequence: v[4],
          ...(v[6].length ? { options: v[6] } : {}),
          codeComment: combineComments(v[1], v[3], v[5], v[7], v[8].comment),
        },
      },
    };
  }
);
