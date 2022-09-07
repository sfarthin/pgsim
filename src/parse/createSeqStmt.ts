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
  __,
  EOS,
} from "./util";
import { CreateSeqStmt } from "~/types";
import { defElemList } from "./defElem";

export const createSeqStmt: Rule<{
  eos: EOS;
  value: { CreateSeqStmt: CreateSeqStmt };
}> = transform(
  sequence([
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
      eos: v[10],
      value: {
        CreateSeqStmt: {
          sequence: v[6],
          ...(v[8]?.length
            ? {
                options: v[8],
              }
            : {}),
          ...(v[4] !== null ? { if_not_exists: true } : {}),
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[9],
            v[10].comment
          ),
        },
      },
    };
  }
);
