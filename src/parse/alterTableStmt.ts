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
    transform(identifier, (v, ctx) => ({ value: v, pos: ctx.pos })),
    alterTableCmd, // 10
    zeroToMany(sequence([COMMA, alterTableCmd])),
    endOfStatement,
  ]),
  (v) => {
    const alterCmds = v[11].map((i) => i[1]);
    return {
      relation: {
        RangeVar: {
          // schemaname?: string;
          relname: v[9].value,
          // 0 = No, 1 = Yes, 2 = Default
          // https://docs.huihoo.com/doxygen/postgresql/primnodes_8h.html#a3a00c823fb80690cdf8373d6cb30b9c8
          // inhOpt?: number;
          // p = permanent table, u = unlogged table, t = temporary table
          relpersistence: "p",
          location: v[9].pos,
          ...(!v[7] ? { inh: true } : {}),
          // alias?: { Alias: Alias };
        },
      },
      cmds: [v[10]]
        .concat(alterCmds)
        .map((AlterTableCmd) => ({ AlterTableCmd })),
      relkind: 37,
      ...(v[5] ? { missing_ok: true } : {}),
      comment: combineComments(v[0], v[2], v[4], v[5]?.[1], v[6], v[8], v[12]),
    };
  }
);
