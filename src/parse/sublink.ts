import {
  sequence,
  Rule,
  LPAREN,
  RPAREN,
  __,
  EXISTS,
  transform,
  combineComments,
  Context,
  IN,
  or,
  keyword,
  maybeInParens,
  optional,
  NOT,
} from "./util";
import { select } from "./selectStmt";
import { BoolOp, SubLink, SubLinkType } from "~/types";
import { rawValue, rawValuePostfix } from "./rawExpr";

export const subLinkExists: Rule<{
  value: { SubLink: SubLink };
  codeComment: string;
}> = transform(sequence([EXISTS, __, LPAREN, __, select, __, RPAREN]), (v) => {
  return {
    value: {
      SubLink: {
        subLinkType: SubLinkType.EXISTS_SUBLINK,
        subselect: {
          SelectStmt: v[4].value,
        },
        location: v[0].start,
      },
    },
    codeComment: combineComments(v[1], v[3], v[5]),
  };
});

export const subLinkExpr: Rule<{
  value: { SubLink: SubLink };
  codeComment: string;
}> = transform(sequence([LPAREN, __, select, __, RPAREN]), (v) => {
  return {
    value: {
      SubLink: {
        subLinkType: SubLinkType.EXPR_SUBLINK,
        subselect: {
          SelectStmt: v[2].value,
        },
        location: v[0].start,
      },
    },
    codeComment: combineComments(v[1], v[3]),
  };
});

export const subLinkArray: Rule<{
  value: { SubLink: SubLink };
  codeComment: string;
}> = transform(
  sequence([
    keyword("array" as any),
    __,
    LPAREN,
    __,
    maybeInParens(select),
    __,
    RPAREN,
  ]),
  (v) => {
    return {
      value: {
        SubLink: {
          subLinkType: SubLinkType.ARRAY_SUBLINK,
          subselect: {
            SelectStmt: v[4].value.value,
          },
          location: v[0].start,
        },
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[4].topCodeComment,
        v[4].bottomCodeComment,
        v[5]
      ),
    };
  }
);

export const subLink = or([subLinkArray, subLinkExists, subLinkExpr]);

export const subLinkConnection = (ctx: Context) =>
  rawValuePostfix(
    sequence([__, optional(NOT), __, IN, __, LPAREN, __, select, __, RPAREN]),
    (c1, v) => {
      const sublink = {
        SubLink: {
          subLinkType: SubLinkType.ANY_SUBLINK,
          testexpr: c1.value,
          subselect: { SelectStmt: v[7].value },
          location: v[1]?.start ?? v[3].start,
        },
      } as const;

      return {
        value: v[1]
          ? {
              BoolExpr: {
                boolop: BoolOp.NOT_EXPR,
                args: [sublink],
                location: v[1].start,
              },
            }
          : sublink,
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[4],
          v[6],
          v[7].value.codeComment,
          v[8]
        ),
      };
    }
  )(ctx);
