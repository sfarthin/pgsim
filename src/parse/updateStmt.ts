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
} from "./util";
import { UpdateStmt, ResTarget } from "~/types";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";

const resTarget: Rule<{
  value: { ResTarget: ResTarget };
  codeComment: string;
}> = transform(
  sequence([identifier, __, EQUALS, __, or([typeCast, aConst])]), // <-- We can add table names here.
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

export const updateStmt: Rule<{ eos: EOS; value: { UpdateStmt: UpdateStmt } }> =
  transform(
    sequence([
      UPDATE,
      __,
      transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
      __,
      SET,
      __,
      resTarget, // 7
      zeroToMany(sequence([__, COMMA, __, resTarget])),
      __,
      endOfStatement,
    ]),
    (v) => {
      return {
        eos: v[9],
        value: {
          UpdateStmt: {
            relation: {
              relname: v[2].value,
              relpersistence: "p",
              location: v[2].pos,
              inh: true,
            },
            targetList: [v[6].value, ...v[7].map((k) => k[3].value)],
            codeComment: combineComments(
              v[1],
              v[3],
              v[5],
              v[6].codeComment,
              ...v[7].flatMap((k) => [k[0], k[2], k[3].codeComment]),
              v[8],
              v[9].comment
            ),
          },
        },
      };
    }
  );
