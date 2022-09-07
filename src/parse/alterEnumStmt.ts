import {
  Rule,
  __,
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
      eos: v[16],
      value: {
        AlterEnumStmt: {
          typeName: [
            {
              String: {
                str: v[4],
              },
            },
          ],
          newVal: v[12].value,
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[9],
            v[10]?.codeComment,
            v[11],
            v[13],
            v[14]?.codeComment,
            v[15],
            v[16].comment
          ),
          ...(v[14]?.where !== "BEFORE" ? { newValIsAfter: true } : {}),
          ...(v[14] ? { newValNeighbor: v[14].value } : {}),
          ...(v[10] !== null ? { skipIfNewValExists: true } : {}),
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
      eos: v[16],
      value: {
        AlterEnumStmt: {
          typeName: [
            {
              String: {
                str: v[4],
              },
            },
          ],
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[9],
            v[11],
            v[13],
            v[15],
            v[16].comment
          ),
          oldVal: v[10].value,
          newVal: v[14].value,
        },
      },
    };
  }
);

export const alterEnumStmt: Rule<{
  eos: EOS;
  value: { AlterEnumStmt: AlterEnumStmt };
}> = or([alterEnumStmtAdd, alterEnumStmtRename]);
