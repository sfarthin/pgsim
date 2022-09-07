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
      eos: v[12],
      value: {
        AlterDatabaseStmt: {
          dbname: v[4],
          options: [{ DefElem: v[10] }],
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[9],
            v[11],
            v[12].comment
          ),
        },
      },
    };
  }
);

export const alterDatabaseStmt = or([setTablespace]);
