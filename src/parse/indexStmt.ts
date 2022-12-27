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
} from "./util";

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
      optional(identifier),
      __, // 9
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
      ), // 14
      __,
      LPAREN,
      __,
      identifier, // 18
      __,
      zeroToMany(sequence([COMMA, __, identifier])), // 20
      __, // 21
      RPAREN,
      __,
      optional(sequence([WHERE, __, rawValue])),
      __,
      endOfStatement,
    ]),
    (v) => {
      return {
        eos: v[26],
        value: {
          IndexStmt: {
            ...(v[8] ? { idxname: v[8] } : {}),
            relation: {
              relname: v[12].value,
              inh: true,
              relpersistence: "p",
              location: v[12].pos,
            },
            ...(v[14] ? { accessMethod: v[14][2] } : {}),
            accessMethod:
              v[14]?.[2].value === "hash"
                ? "hash"
                : v[14]?.[2].value === "gin"
                ? "gin"
                : "btree",
            indexParams: [v[18], ...v[20].map((i) => i[2])].map((j) => ({
              IndexElem: {
                name: j,
                ordering: "SORTBY_DEFAULT",
                nulls_ordering: "SORTBY_NULLS_DEFAULT",
              },
            })),
            ...(v[2] ? { unique: true } : {}),
            ...(v[24] ? { whereClause: v[24][2].value } : {}),
            codeComment: combineComments(
              v[1],
              v[3],
              v[5],
              v[7],
              v[9],
              v[11],
              v[13],
              v[14]?.[1],
              v[15],
              v[17],
              v[19],
              ...v[20].map((i) => i[1]),
              v[21],
              v[23],
              v[24]?.[1],
              v[24]?.[2]?.codeComment,
              v[25],
              v[26].comment
            ),
          },
        },
      };
    }
  );
