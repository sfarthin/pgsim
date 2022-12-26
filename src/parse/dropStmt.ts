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
  keyword,
  INDEX,
  CONCURRENTLY,
} from "./util";
import { RemoveType, DropStmt, TypeName } from "~/types";

export const dropIndexStmt: Rule<{ eos: EOS; value: { DropStmt: DropStmt } }> =
  transform(
    sequence([
      DROP,
      __,
      INDEX,
      __,
      optional(CONCURRENTLY), // 4
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
    (v) => {
      const codeComment = combineComments(
        v[1],
        v[3],
        v[5],
        v[6],
        v[8],
        v[10],
        v[11].comment
      );
      const restrictOrCascade = v[9]?.value;
      const behavior =
        restrictOrCascade === "CASCADE" ? "DROP_CASCADE" : "DROP_RESTRICT";
      const item = v[7].value;
      const missing_ok = v[6] !== null;
      const concurrent = v[4] !== null;

      return {
        eos: v[11],
        value: {
          DropStmt: {
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
            removeType: RemoveType.OBJECT_INDEX,
            concurrent,
            behavior,
            codeComment,
            ...(missing_ok ? { missing_ok } : {}),
          },
        },
      };
    }
  );

export const dropStmtGeneral: Rule<{
  eos: EOS;
  value: { DropStmt: DropStmt };
}> = transform(
  sequence([
    DROP,
    __,
    or([TABLE, SEQUENCE, TYPE, VIEW, keyword("MATERIALIZED VIEW" as any)]),
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

    if (type === "TYPE") {
      return {
        eos: value[9],
        value: {
          DropStmt: {
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
          },
        },
      };
    }

    return {
      eos: value[9],
      value: {
        DropStmt: {
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
              : type === "VIEW"
              ? RemoveType.OBJECT_VIEW
              : RemoveType.OBJECT_MATVIEW,
          behavior,
          codeComment,
          ...(missing_ok ? { missing_ok } : {}),
        },
      },
    };
  }
);

export const dropStmt = or([dropIndexStmt, dropStmtGeneral]);
