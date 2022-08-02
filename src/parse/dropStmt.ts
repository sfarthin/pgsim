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
  VIEW,
  EOS,
} from "./util";
import {
  RemoveType,
  DropStmt,
  TypeName,
  DropStmtSequence,
  DropStmtTable,
  DropStmtType,
} from "~/types";

export const dropStmt: Rule<{ eos: EOS; value: { DropStmt: DropStmt } }> =
  transform(
    sequence([
      _,
      DROP,
      __,
      or([TABLE, SEQUENCE, TYPE, VIEW]),
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
        value[10].comment
      );
      const restrictOrCascade = value[8]?.value;
      const behavior =
        restrictOrCascade === "CASCADE" ? "DROP_CASCADE" : "DROP_RESTRICT";
      const type = value[3].value;
      const item = value[6].value;
      const missing_ok = value[5] !== null;

      let result;
      if (type === "TYPE") {
        result = {
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
          removeType: RemoveType.OBJECT_TYPE,
          behavior,
          codeComment,
          ...(missing_ok ? { missing_ok } : {}),
        } as DropStmtType;
      } else {
        result = {
          objects: [
            {
              List: {
                items: [
                  {
                    String: {
                      str: item,
                    },
                  },
                ],
              },
            },
          ],
          removeType:
            type === "SEQUENCE"
              ? RemoveType.OBJECT_SEQUENCE
              : type === "TABLE"
              ? RemoveType.OBJECT_TABLE
              : RemoveType.OBJECT_VIEW,
          behavior,
          codeComment,
          ...(missing_ok ? { missing_ok } : {}),
        } as DropStmtSequence | DropStmtTable;
      }

      return {
        eos: value[10],
        value: { DropStmt: result },
      };
    }
  );
