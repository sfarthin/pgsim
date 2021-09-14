import { AlterTableStmt } from "../types";
import {
  sequence,
  transform,
  optional,
  ONLY,
  IF,
  ALTER,
  EXISTS,
  TABLE,
  Rule,
  identifier,
  _,
  __,
  zeroToMany,
  endOfStatement,
  combineComments,
  COMMA,
  PERIOD,
} from "./util";
import { alterTableCmd } from "./alterTableCmd";

export const alterTableStmt: Rule<AlterTableStmt> = transform(
  sequence([
    _,
    ALTER,
    __,
    TABLE,
    __,
    optional(sequence([IF, __, EXISTS])), // 5
    __,
    optional(ONLY),
    __,
    transform(
      sequence([optional(sequence([identifier, PERIOD])), identifier]),
      (v, ctx) => ({
        ...(v[0]?.[0] ? { schemaname: v[0][0] } : {}),
        relname: v[1],
        relpersistence: "p" as const,
        location: ctx.pos,
      })
    ),
    alterTableCmd, // 10
    zeroToMany(sequence([COMMA, alterTableCmd])),
    endOfStatement,
  ]),
  (v) => {
    const alterCmds = v[11].map((i) => i[1]);
    return {
      relation: {
        ...v[9],
        ...(!v[7] ? { inh: true } : {}),
      },
      cmds: [v[10]]
        .concat(alterCmds)
        .map((AlterTableCmd) => ({ AlterTableCmd })),
      relkind: "OBJECT_TABLE",
      ...(v[5] ? { missing_ok: true } : {}),
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[5]?.[1],
        v[6],
        v[8],
        v[12]
      ),
    };
  }
);
