import {
  sequence,
  Rule,
  LPAREN,
  RPAREN,
  __,
  EXISTS,
  transform,
  combineComments,
} from "./util";
import { select } from "./selectStmt";
import { SubLink, SubLinkType } from "../types";

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
