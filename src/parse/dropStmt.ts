import {
  or,
  Rule,
  DROP,
  TABLE,
  SEQUENCE,
  TYPE,
  transform,
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
        value[1],
        value[3],
        value[4],
        value[6],
        value[8],
        value[9].comment
      );
      const restrictOrCascade = value[7]?.value;
      const behavior =
        restrictOrCascade === "CASCADE" ? "DROP_CASCADE" : "DROP_RESTRICT";
      const type = value[2].value;
      const item = value[5].value;
      const missing_ok = value[4] !== null;

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
                location: value[5].pos,
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
        eos: value[9],
        value: { DropStmt: result },
      };
    }
  );
