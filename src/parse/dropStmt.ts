import {
  or,
  Rule,
  DROP,
  TABLE,
  SEQUENCE,
  TYPE,
  transform,
  _,
  __,
  identifier,
  sequence,
  endOfStatement,
  combineComments,
  IF,
  EXISTS,
  optional,
  RESTRICT,
  CASCADE,
} from "./util";
import {
  RemoveType,
  DropStmt,
  String,
  TypeName,
  DropStmtSequence,
  DropStmtTable,
  DropStmtType,
} from "../types";

export const dropStmt: Rule<DropStmt> = transform(
  sequence([
    _,
    DROP,
    __,
    or([TABLE, SEQUENCE, TYPE]),
    __,
    optional(
      transform(sequence([IF, __, EXISTS, __]), (v) =>
        combineComments(v[1], v[3])
      )
    ),
    transform(identifier, (v, ctx) => ({ value: v, pos: ctx.pos })),
    __,
    optional(or([RESTRICT, CASCADE])),
    __,
    endOfStatement,
  ]),
  (value) => {
    const codeComment = combineComments(
      value[0],
      value[2],
      value[4],
      value[5],
      value[7],
      value[9],
      value[10]
    );
    const restrictOrCascade = value[8]?.value;
    const behavior = restrictOrCascade === "CASCADE" ? 1 : 0;
    const type = value[3].value;
    const item = value[6].value;
    const missing_ok = value[5] !== null;

    if (type === "TYPE") {
      return {
        objects: [
          {
            TypeName: {
              names: [
                {
                  String: {
                    str: item,
                  },
                },
              ],
              typemod: -1,
              location: value[6].pos,
            },
          },
        ] as [{ TypeName: TypeName }],
        removeType: RemoveType.TYPE,
        behavior,
        codeComment,
        ...(missing_ok ? { missing_ok } : {}),
      } as DropStmtType;
    }
    return {
      objects: [
        [
          {
            String: {
              str: item,
            },
          },
        ],
      ] as [[{ String: String }]],
      removeType: type === "SEQUENCE" ? RemoveType.SEQUENCE : RemoveType.TABLE,
      behavior,
      codeComment,
      ...(missing_ok ? { missing_ok } : {}),
    } as DropStmtSequence | DropStmtTable;
  }
);
