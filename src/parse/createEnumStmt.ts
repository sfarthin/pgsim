import {
  transform,
  CREATE,
  TYPE,
  identifier,
  AS,
  ENUM,
  LPAREN,
  oneToMany,
  RPAREN,
  Rule,
  sequence,
  endOfStatement,
  quotedString,
  COMMA,
  combineComments,
  _,
  __,
} from "./util";
import { CreateEnumStmt } from "../types";

const enumList = transform(
  sequence([
    LPAREN,
    __,
    quotedString,
    oneToMany(sequence([__, COMMA, __, quotedString])),
    __,
    RPAREN,
  ]),
  (v) => {
    const list = [
      { codeComment: v[1], String: { str: v[2] } },
      ...v[3].map((r) => ({
        codeComment: combineComments(r[0], r[2]),
        String: { str: r[3] },
      })),
    ];
    return [
      ...list.slice(0, -1),
      {
        String: list[list.length - 1].String,
        codeComment: combineComments(list[list.length - 1].codeComment, v[4]),
      },
    ];
  }
);

export const createEnumStmt: Rule<CreateEnumStmt> = transform(
  sequence([
    _,
    CREATE,
    __,
    TYPE,
    __,
    identifier,
    __, // 6
    AS,
    __,
    ENUM,
    __,
    enumList, // 11
    __,
    endOfStatement,
  ]),
  (v) => ({
    typeName: [{ String: { str: v[5] } }],
    vals: v[11],
    codeComment: combineComments(
      v[0],
      v[2],
      v[4],
      v[6],
      v[8],
      v[10],
      v[12],
      v[13]
    ),
  })
);
