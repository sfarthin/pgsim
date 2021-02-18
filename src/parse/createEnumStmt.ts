import {
  transform,
  CREATE,
  TYPE,
  identifier,
  AS,
  ENUM,
  LPAREN,
  listWithCommentsPerItem,
  RPAREN,
  Rule,
  phrase,
  endOfStatement,
  quotedString,
  COMMA,
  sequence,
  combineComments,
  finalizeComment,
} from "./util";
import { CreateEnumStmt } from "../types";

const enumList = transform(
  sequence([LPAREN, listWithCommentsPerItem(quotedString, COMMA), RPAREN]),
  (v) => v[1]
);

export const createEnumStmt: Rule<CreateEnumStmt> = transform(
  phrase([CREATE, TYPE, identifier, AS, ENUM, enumList, endOfStatement]),
  ({ codeComment, value }) => ({
    typeName: [{ String: { str: value[2] } }],
    vals: value[5].value.map(({ value, codeComment }) => ({
      String: { str: value },
      codeComment: finalizeComment(codeComment),
    })),
    codeComment: finalizeComment(
      combineComments(codeComment, value[5].codeComment, value[6])
    ),
  })
);
