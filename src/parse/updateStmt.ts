import {
  transform,
  Rule,
  sequence,
  _,
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
} from "./util";
import { UpdateStmt, ResTarget } from "../types";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";

const resTarget: Rule<{
  value: { ResTarget: ResTarget };
  codeComment: string;
}> = transform(
  sequence([identifier, __, EQUALS, __, or([typeCast, aConst])]),
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

export const updateStmt: Rule<UpdateStmt> = transform(
  sequence([
    _,
    UPDATE,
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    SET,
    __,
    resTarget, // 7
    zeroToMany(sequence([__, COMMA, __, resTarget])),
    endOfStatement,
  ]),
  (v) => {
    return {
      relation: {
        relname: v[3].value,
        relpersistence: "p",
        location: v[3].pos,
        inh: true,
      },
      targetList: [v[7].value, ...v[8].map((k) => k[3].value)],
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[6],
        v[7].codeComment,
        ...v[8].flatMap((k) => [k[0], k[2], k[3].codeComment]),
        v[9]
      ),
    };
  }
);
