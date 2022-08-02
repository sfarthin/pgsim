import { rawValue } from "./rawExpr";
import {
  sequence,
  __,
  combineComments,
  transform,
  Rule,
  CASE,
  WHEN,
  THEN,
  END,
  ELSE,
  oneToMany,
  optional,
} from "./util";
import { CaseWhen, CaseExpr } from "~/types";

const caseWhen: Rule<{
  value: { CaseWhen: CaseWhen };
  codeComment: string;
}> = transform(
  sequence([
    __,
    WHEN,
    __,
    (ctx) => rawValue(ctx),
    __,
    THEN,
    __,
    (ctx) => rawValue(ctx),
  ]),
  (v) => {
    return {
      value: {
        CaseWhen: {
          expr: v[3].value,
          result: v[7].value,
          location: v[1].start,
        },
      },
      codeComment: combineComments(
        v[0],
        v[2],
        v[3].codeComment,
        v[4],
        v[6],
        v[7].codeComment
      ),
    };
  }
);

const elseClause = transform(
  sequence([__, ELSE, __, (ctx) => rawValue(ctx)]),
  (v) => {
    return {
      value: v[3].value,
      codeComment: combineComments(v[0], v[2], v[3].codeComment),
    };
  }
);

export const caseExpr: Rule<{
  value: { CaseExpr: CaseExpr };
  codeComment: string;
}> = transform(
  sequence([CASE, __, oneToMany(caseWhen), optional(elseClause), __, END]),
  (v, ctx) => {
    return {
      value: {
        CaseExpr: {
          args: v[2].map((v) => v.value),
          ...(v[3] ? { defresult: v[3].value } : {}),
          location: ctx.pos,
        },
      },
      codeComment: combineComments(
        v[1],
        ...v[2].map((r) => r.codeComment),
        v[3]?.codeComment,
        v[4]
      ),
    };
  }
);
