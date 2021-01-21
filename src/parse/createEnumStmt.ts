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
import { CreateEnumStmt } from "~/types";

const enumList = transform(
  sequence([LPAREN, listWithCommentsPerItem(quotedString, COMMA), RPAREN]),
  (v) => v[1]
);

export const createEnumStmt: Rule<CreateEnumStmt> = transform(
  phrase([CREATE, TYPE, identifier, AS, ENUM, enumList, endOfStatement]),
  ({ comment, value }) => ({
    typeName: [{ String: { str: value[2] } }],
    vals: value[5].value.map(({ value, comment }) => ({
      String: { str: value },
      comment: finalizeComment(comment),
    })),
    comment: finalizeComment(
      combineComments(comment, value[5].comment, value[6])
    ),
  })
);
