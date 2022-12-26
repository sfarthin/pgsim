import {
  InsertStmt,
  InsertCols,
  RelationInsert,
  ReturningInsert,
} from "~/types";
import { columnRef } from "./columnRef";
import { rawValue } from "./rawExpr";
import { select } from "./selectStmt";
import {
  Rule,
  EOS,
  transform,
  sequence,
  INSERT,
  INTO,
  __,
  identifier,
  LPAREN,
  zeroToMany,
  COMMA,
  combineComments,
  RPAREN,
  VALUES,
  endOfStatement,
  optional,
  RETURNING,
  or,
} from "./util";

const resTarget = transform(identifier, (v, ctx) => {
  return {
    name: v,
    location: ctx.pos,
  };
});

const cols: Rule<{
  codeComment: string;
  value: InsertCols;
}> = transform(
  sequence([resTarget, zeroToMany(sequence([__, COMMA, __, resTarget]))]),
  (v) => {
    return {
      value: [{ ResTarget: v[0] }, ...v[1].map((s) => ({ ResTarget: s[3] }))],
      codeComment: combineComments(...v[1].flatMap((s) => [s[0], s[2]])),
    };
  }
);

const returningResTarget = transform(columnRef, (v, ctx) => {
  return {
    codeComment: v.codeComment,
    value: { ResTarget: { val: v.value, location: ctx.pos } },
  };
});

const returningList: Rule<{ codeComment: string; value: ReturningInsert }> =
  transform(
    sequence([
      RETURNING,
      __,
      returningResTarget,
      zeroToMany(sequence([__, COMMA, __, returningResTarget])),
    ]),
    (v) => {
      return {
        codeComment: combineComments(
          v[1],
          v[2].codeComment,
          ...v[3].flatMap((k) => [k[0], k[2], k[3].codeComment])
        ),
        value: [v[2].value, ...v[3].map((k) => k[3].value)],
      };
    }
  );

const valueList = transform(
  sequence([
    (ctx) => rawValue(ctx),
    zeroToMany(sequence([__, COMMA, __, (ctx) => rawValue(ctx)])),
  ]),
  (v) => {
    return {
      value: [v[0].value, ...v[1].map((s) => s[3].value)],
      codeComment: combineComments(
        v[0].codeComment,
        ...v[1].flatMap((s) => [s[0], s[2], s[3].codeComment])
      ),
    };
  }
);

const relation: Rule<RelationInsert> = transform(identifier, (v, ctx) => {
  return {
    relname: v,
    inh: true,
    relpersistence: "p",
    location: ctx.pos,
  };
});

export const insertStmtWithValues: Rule<{
  value: { InsertStmt: InsertStmt };
  eos: EOS;
}> = transform(
  sequence([
    INSERT,
    __,
    INTO,
    __,
    relation,
    __,
    LPAREN,
    __,
    cols,
    __,
    RPAREN, // 10
    __,
    VALUES,
    __,
    LPAREN,
    __,
    valueList,
    __,
    RPAREN,
    __,
    optional(returningList),
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      eos: v[22],
      value: {
        InsertStmt: {
          relation: v[4],
          cols: v[8].value,
          selectStmt: {
            SelectStmt: {
              valuesLists: [{ List: { items: v[16].value } }],
              limitOption: "LIMIT_OPTION_DEFAULT",
              op: "SETOP_NONE",
            },
          },
          override: "OVERRIDING_NOT_SET",
          ...(v[20] ? { returningList: v[20].value } : {}),
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[8].codeComment,
            v[9],
            v[11],
            v[13],
            v[15],
            v[16].codeComment,
            v[17],
            v[19],
            v[20]?.codeComment,
            v[21],
            v[22].comment
          ),
        },
      },
    };
  }
);

export const insertStmtWithStmt: Rule<{
  value: { InsertStmt: InsertStmt };
  eos: EOS;
}> = transform(
  sequence([
    INSERT,
    __,
    INTO,
    __,
    relation,
    __,
    LPAREN,
    __,
    cols,
    __,
    RPAREN, // 10
    __,
    LPAREN,
    __,
    select,
    __,
    RPAREN, // 16
    __,
    optional(returningList),
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      eos: v[20],
      value: {
        InsertStmt: {
          relation: v[4],
          cols: v[8].value,
          selectStmt: {
            SelectStmt: v[14].value,
          },
          override: "OVERRIDING_NOT_SET",
          ...(v[18] ? { returningList: v[18].value } : {}),
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[8].codeComment,
            v[9],
            v[11],
            v[13],
            v[14].value.codeComment,
            v[15],
            v[17],
            v[19],
            v[20].comment
          ),
        },
      },
    };
  }
);

export const insertStmt: Rule<{
  value: { InsertStmt: InsertStmt };
  eos: EOS;
}> = or([insertStmtWithValues, insertStmtWithStmt]);
