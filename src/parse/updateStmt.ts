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
  EOS,
  WHERE,
  optional,
} from "./util";
import { UpdateStmt, ResTarget, RangeVar } from "~/types";
import { rawValue } from "./rawExpr";
import { rangeVar } from "./rangeVar";

const resTarget: Rule<{
  value: { ResTarget: ResTarget };
  codeComment: string;
}> = transform(sequence([identifier, __, EQUALS, __, rawValue]), (v, ctx) => {
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
});

const whereClause = transform(sequence([WHERE, __, rawValue]), (v) => {
  return {
    value: v[2].value,
    codeComment: combineComments(v[1], v[2].codeComment),
  };
});

const relation: Rule<{ value: RangeVar; codeComment: string }> = transform(
  rangeVar,
  (v, ctx) => ({
    value: {
      relname: v.value.RangeVar.relname,
      relpersistence: v.value.RangeVar.relpersistence,
      location: ctx.pos,
      inh: true,
      ...(v.value.RangeVar.alias ? { alias: v.value.RangeVar.alias } : {}),
    },
    codeComment: v.codeComment,
  })
);

export const updateStmt: Rule<{ eos: EOS; value: { UpdateStmt: UpdateStmt } }> =
  transform(
    sequence([
      UPDATE,
      __,
      relation,
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
            relation: v[2].value,
            targetList: [v[6].value, ...v[7].map((k) => k[3].value)],
            ...(v[9] ? { whereClause: v[9].value } : {}),
            codeComment: combineComments(
              v[1],
              v[2].codeComment,
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
