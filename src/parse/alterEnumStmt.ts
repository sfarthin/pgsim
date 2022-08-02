import {
  Rule,
  __,
  _,
  sequence,
  ALTER,
  TYPE,
  identifier,
  ADD,
  VALUE,
  ifNotExists,
  quotedString,
  optional,
  or,
  AFTER,
  BEFORE,
  combineComments,
  transform,
  endOfStatement,
  RENAME,
  TO,
  EOS,
} from "./util";
import { AlterEnumStmt } from "~/types";

const afterOrBefore = transform(
  or([
    sequence([AFTER, __, quotedString]),
    sequence([BEFORE, __, quotedString]),
  ]),
  (v) => ({
    where: v[0].value,
    value: v[2].value,
    codeComment: v[1],
  })
);

export const alterEnumStmtAdd: Rule<{
  eos: EOS;
  value: { AlterEnumStmt: AlterEnumStmt };
}> = transform(
  sequence([
    _, // 0
    ALTER,
    __,
    TYPE,
    __,
    identifier, // 5
    __,
    ADD,
    __,
    VALUE,
    __, // 10
    optional(ifNotExists),
    __,
    quotedString, // 13
    __,
    optional(afterOrBefore), // 15
    __,
    endOfStatement, // 17
  ]),
  (v) => {
    return {
      eos: v[17],
      value: {
        AlterEnumStmt: {
          typeName: [
            {
              String: {
                str: v[5],
              },
            },
          ],
          newVal: v[13].value,
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[10],
            v[11]?.codeComment,
            v[12],
            v[14],
            v[15]?.codeComment,
            v[16],
            v[17].comment
          ),
          ...(v[15]?.where !== "BEFORE" ? { newValIsAfter: true } : {}),
          ...(v[15] ? { newValNeighbor: v[15].value } : {}),
          ...(v[11] !== null ? { skipIfNewValExists: true } : {}),
        },
      },
    };
  }
);

export const alterEnumStmtRename: Rule<{
  eos: EOS;
  value: { AlterEnumStmt: AlterEnumStmt };
}> = transform(
  sequence([
    _, // 0
    ALTER,
    __,
    TYPE,
    __,
    identifier, // 5
    __,
    RENAME,
    __,
    VALUE,
    __, // 10
    quotedString,
    __,
    TO,
    __,
    quotedString, // 15
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      eos: v[17],
      value: {
        AlterEnumStmt: {
          typeName: [
            {
              String: {
                str: v[5],
              },
            },
          ],
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[10],
            v[12],
            v[14],
            v[16],
            v[17].comment
          ),
          oldVal: v[11].value,
          newVal: v[15].value,
        },
      },
    };
  }
);

export const alterEnumStmt: Rule<{
  eos: EOS;
  value: { AlterEnumStmt: AlterEnumStmt };
}> = or([alterEnumStmtAdd, alterEnumStmtRename]);
