import { IndexStmt } from "~/types";
import { rawValue } from "./rawExpr";
import {
  sequence,
  transform,
  Rule,
  UNIQUE,
  CREATE,
  CONCURRENTLY,
  INDEX,
  ON,
  USING,
  identifier,
  optional,
  __,
  LPAREN,
  RPAREN,
  endOfStatement,
  combineComments,
  or,
  keyword,
  zeroToMany,
  COMMA,
  EOS,
  WHERE,
  IF,
  NOT,
  EXISTS,
} from "./util";
import { indexElem } from "./indexElem";

// -- CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ name ] ON table [ USING method ]
// --     ( { column | ( expression ) } [ COLLATE collation ] [ opclass ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
// --     [ WITH ( storage_parameter = value [, ... ] ) ]
// --     [ TABLESPACE tablespace ]
// --     [ WHERE predicate ]

export const indexStmt: Rule<{ eos: EOS; value: { IndexStmt: IndexStmt } }> =
  transform(
    sequence([
      CREATE,
      __,
      optional(UNIQUE),
      __,
      INDEX, // 4
      __,
      optional(CONCURRENTLY),
      __,
      optional(sequence([IF, __, NOT, __, EXISTS])), // 8
      __,
      optional(identifier),
      __, // 11
      sequence([
        ON,
        __,
        transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
        __,
        optional(
          sequence([
            USING,
            __,
            or([
              keyword("hash" as any),
              keyword("btree" as any),
              keyword("gin" as any),
            ]),
          ])
        ), // 4
        __,
        LPAREN,
        __,
        indexElem, // 8
        __,
        zeroToMany(sequence([COMMA, __, indexElem])), // 10
        __, // 11
        RPAREN,
        __,
        optional(sequence([WHERE, __, rawValue])),
        __,
      ]),
      endOfStatement,
    ]),
    (v) => {
      const postfix = v[12];

      return {
        eos: v[13],
        value: {
          IndexStmt: {
            ...(v[6] ? { concurrent: true } : {}),
            ...(v[10] ? { idxname: v[10] } : {}),
            ...(v[8] ? { if_not_exists: true } : {}),
            relation: {
              relname: postfix[2].value,
              inh: true,
              relpersistence: "p",
              location: postfix[2].pos,
            },
            accessMethod:
              postfix[4]?.[2].value === "hash"
                ? "hash"
                : postfix[4]?.[2].value === "gin"
                ? "gin"
                : "btree",
            indexParams: [
              postfix[8].value,
              ...postfix[10].map((i) => i[2].value),
            ],
            ...(v[2] ? { unique: true } : {}),
            ...(postfix[14] ? { whereClause: postfix[14][2].value } : {}),
            codeComment: combineComments(
              v[1],
              v[3],
              v[5],
              v[7],
              v[9],
              v[11],

              postfix[1],
              postfix[3],
              postfix[4]?.[1],
              postfix[5],
              postfix[7],
              postfix[8].codeComment,
              postfix[9],
              ...postfix[10].flatMap((i) => [i[1], i[2].codeComment]),
              postfix[11],
              postfix[13],
              postfix[14]?.[1],
              postfix[14]?.[2].codeComment,
              postfix[15],

              v[13].comment
            ),
          },
        },
      };
    }
  );
