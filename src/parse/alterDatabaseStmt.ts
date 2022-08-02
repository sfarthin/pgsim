import {
  transform,
  ALTER,
  DATABASE,
  identifier,
  Rule,
  endOfStatement,
  combineComments,
  sequence,
  __,
  _,
  EOS,
  SET,
  or,
  TABLESPACE,
} from "./util";
import { AlterDatabaseStmt } from "~/types";

const setTablespace: Rule<{
  eos: EOS;
  value: { AlterDatabaseStmt: AlterDatabaseStmt };
}> = transform(
  sequence([
    _,
    ALTER,
    __,
    DATABASE,
    __,
    identifier, // 5
    __,
    SET,
    __,
    TABLESPACE,
    __,
    transform(identifier, (v, ctx) => {
      return {
        arg: {
          String: {
            str: v,
          },
        },
        defaction: "DEFELEM_UNSPEC",
        defname: "tablespace",
        location: ctx.pos,
      } as const;
    }),
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      eos: v[13],
      value: {
        AlterDatabaseStmt: {
          dbname: v[5],
          options: [{ DefElem: v[11] }],
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[10],
            v[12],
            v[13].comment
          ),
        },
      },
    };
  }
);

export const alterDatabaseStmt = or([setTablespace]);
