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
} from "./util";
import { CreateEnumStmt } from "~/types";

export const createEnumStmt: Rule<CreateEnumStmt> = transform(
  statement([
    CREATE,
    TYPE,
    tableIdentifier,
    AS,
    ENUM,
    LPAREN,
    list(quotedString, COMMA),
    RPAREN,
  ]),
  ({ comment, value }) => ({
    typeName: [{ String: { str: value[2] } }],
    vals: value[6].map(({ value, comment }) => ({
      String: { str: value },
      comment,
    })),
    comment,
  })
);
