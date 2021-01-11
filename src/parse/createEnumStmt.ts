import {
  transform,
  CREATE,
  TYPE,
  tableIdentifier,
  AS,
  ENUM,
  LPAREN,
  list,
  RPAREN,
  Rule,
  statement,
  quotedString,
  COMMA,
  sequence,
  combineComments,
} from "./util";
import { CreateEnumStmt } from "~/types";

const enumList = transform(
  sequence([LPAREN, list(quotedString, COMMA), RPAREN]),
  (v) => v[1]
);

export const createEnumStmt: Rule<CreateEnumStmt> = transform(
  statement([CREATE, TYPE, tableIdentifier, AS, ENUM, enumList]),
  ({ comment, value }) => ({
    typeName: [{ String: { str: value[2] } }],
    vals: value[5].value.map(({ value, comment }) => ({
      String: { str: value },
      comment,
    })),
    comment: combineComments(comment, value[5].comment),
  })
);
