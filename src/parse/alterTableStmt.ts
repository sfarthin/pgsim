import { AlterTableStmt } from "~/types";
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
  __,
  zeroToMany,
  endOfStatement,
  combineComments,
  COMMA,
  PERIOD,
  EOS,
} from "./util";
import { alterTableCmd } from "./alterTableCmd";

export const alterTableStmt: Rule<{
  eos: EOS;
  value: { AlterTableStmt: AlterTableStmt };
}> = transform(
  sequence([
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
    __, // 10
    alterTableCmd, // 11
    zeroToMany(sequence([__, COMMA, __, alterTableCmd])),
    __,
    endOfStatement,
  ]),
  (v) => {
    const alterCmds = [v[10]].concat(v[11].map((i) => i[3]));

    /**
     * Lets add the comments to the alterCmd level
     */
    alterCmds[0].codeComment = combineComments(v[9], alterCmds[0].codeComment);
    for (let index = 0; index < v[11].length; index++) {
      alterCmds[index + 1].codeComment = combineComments(
        v[11][index][0],
        v[11][index][2],
        alterCmds[index + 1].codeComment
      );
    }

    return {
      eos: v[13],
      value: {
        AlterTableStmt: {
          relation: {
            ...v[8],
            ...(!v[6] ? { inh: true } : {}),
          },
          cmds: alterCmds.map((AlterTableCmd) => ({ AlterTableCmd })),
          relkind: "OBJECT_TABLE",
          ...(v[4] ? { missing_ok: true } : {}),
          codeComment: combineComments(
            v[1],
            v[3],
            v[4]?.[1],
            v[5],
            v[7],
            v[12],
            v[13].comment
          ),
        },
      },
    };
  }
);
