import {
  transform,
  Rule,
  sequence,
  __,
  identifier,
  endOfStatement,
  UPDATE,
  EQUALS,
  zeroToMany,
  combineComments,
  SET,
  COMMA,
  or,
  EOS,
  WHERE,
  optional,
} from "./util";
import { UpdateStmt, ResTarget } from "~/types";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { columnRef } from "./columnRef";
import { rawValue } from "./rawExpr";
import { codeComments } from "./codeComments";

const resTarget: Rule<{
  value: { ResTarget: ResTarget };
  codeComment: string;
}> = transform(
  sequence([identifier, __, EQUALS, __, or([typeCast, aConst, columnRef])]),
  (v, ctx) => {
    return {
      value: {
        ResTarget: {
          name: v[0],
          val: v[4].value,
          location: ctx.pos,
        },
      },
      codeComment: combineComments(v[1], v[3], v[4].codeComment),
    };
  }
);

const whereClause = transform(sequence([WHERE, __, rawValue]), (v) => {
  return {
    value: v[2].value,
    codeComment: combineComments(v[1], v[2].codeComment),
  };
});

export const updateStmt: Rule<{ eos: EOS; value: { UpdateStmt: UpdateStmt } }> =
  transform(
    sequence([
      UPDATE,
      __,
      transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
      __,
      SET,
      __,
      resTarget, // 6
      zeroToMany(sequence([__, COMMA, __, resTarget])),
      __,
      optional(whereClause), // 9
      __,
      endOfStatement,
    ]),
    (v) => {
      return {
        eos: v[11],
        value: {
          UpdateStmt: {
            relation: {
              relname: v[2].value,
              relpersistence: "p",
              location: v[2].pos,
              inh: true,
            },
            targetList: [v[6].value, ...v[7].map((k) => k[3].value)],
            ...(v[9] ? { whereClause: v[9].value } : {}),
            codeComment: combineComments(
              v[1],
              v[3],
              v[5],
              v[6].codeComment,
              ...v[7].flatMap((k) => [k[0], k[2], k[3].codeComment]),
              v[8],
              v[9]?.codeComment,
              v[10],
              v[11].comment
            ),
          },
        },
      };
    }
  );
