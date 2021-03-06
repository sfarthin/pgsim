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
} from "./util";
import { select } from "./selectStmt";
import { SubLink, SubLinkType } from "../types";
import { connectRawValue } from "./rawExpr";

export const subLinkExists: Rule<{
  value: { SubLink: SubLink };
  codeComment: string;
}> = transform(sequence([EXISTS, __, LPAREN, __, select, __, RPAREN]), (v) => {
  return {
    value: {
      SubLink: {
        subLinkType: SubLinkType.EXISTS_SUBLINK,
        subselect: {
          SelectStmt: v[4],
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
          SelectStmt: v[2],
        },
        location: v[0].start,
      },
    },
    codeComment: combineComments(v[1], v[3]),
  };
});

export const subLink = or([subLinkExists, subLinkExpr]);

export const subLinkConnection = (ctx: Context) =>
  connectRawValue(
    sequence([__, IN, __, LPAREN, __, select, __, RPAREN]),
    (c1, v) => {
      return {
        value: {
          SubLink: {
            subLinkType: SubLinkType.ANY_SUBLINK,
            testexpr: c1.value,
            subselect: { SelectStmt: v[5] },
            location: v[1].start,
          },
        },
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[4],
          v[5].codeComment,
          v[6]
        ),
      };
    }
  )(ctx);
