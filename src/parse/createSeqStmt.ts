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
  EOS,
} from "./util";
import { CreateSeqStmt } from "../types";
import { defElemList } from "./defElem";

export const createSeqStmt: Rule<{
  eos: EOS;
  value: { CreateSeqStmt: CreateSeqStmt };
}> = transform(
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
      eos: v[11],
      value: {
        CreateSeqStmt: {
          sequence: v[7],
          ...(v[9]?.length
            ? {
                options: v[9],
              }
            : {}),
          ...(v[5] !== null ? { if_not_exists: true } : {}),
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[10],
            v[11].comment
          ),
        },
      },
    };
  }
);
