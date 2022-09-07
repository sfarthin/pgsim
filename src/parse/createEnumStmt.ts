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
  __,
  EOS,
} from "./util";
import { CreateEnumStmt } from "~/types";

const enumList = transform(
  sequence([
    LPAREN,
    __,
    quotedString, // 2
    oneToMany(sequence([__, COMMA, __, quotedString])),
    __,
    RPAREN,
  ]),
  (v) => {
    const list = [
      { codeComment: v[1], String: { str: v[2].value } },
      ...v[3].map((r) => ({
        codeComment: combineComments(r[0], r[2]),
        String: { str: r[3].value },
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

export const createEnumStmt: Rule<{
  eos: EOS;
  value: { CreateEnumStmt: CreateEnumStmt };
}> = transform(
  sequence([
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
    eos: v[12],
    value: {
      CreateEnumStmt: {
        typeName: [{ String: { str: v[4] } }],
        vals: v[10],
        codeComment: combineComments(
          v[1],
          v[3],
          v[5],
          v[7],
          v[9],
          v[11],
          v[12].comment
        ),
      },
    },
  })
);
