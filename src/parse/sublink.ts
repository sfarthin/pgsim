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
} from "./util";
import { select } from "./selectStmt";
import { SubLink, SubLinkType } from "~/types";
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
    sequence([__, IN, __, LPAREN, __, select, __, RPAREN]),
    (c1, v) => {
      return {
        value: {
          SubLink: {
            subLinkType: SubLinkType.ANY_SUBLINK,
            testexpr: c1.value,
            subselect: { SelectStmt: v[5].value },
            location: v[1].start,
          },
        },
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[4],
          v[5].value.codeComment,
          v[6]
        ),
      };
    }
  )(ctx);
