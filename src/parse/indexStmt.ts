import { IndexStmt } from "../types";
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
  _,
  __,
  LPAREN,
  RPAREN,
  endOfStatement,
  combineComments,
  or,
  keyword,
  zeroToMany,
  COMMA,
} from "./util";

// -- CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ name ] ON table [ USING method ]
// --     ( { column | ( expression ) } [ COLLATE collation ] [ opclass ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
// --     [ WITH ( storage_parameter = value [, ... ] ) ]
// --     [ TABLESPACE tablespace ]
// --     [ WHERE predicate ]

export const indexStmt: Rule<IndexStmt> = transform(
  sequence([
    _,
    CREATE,
    __,
    optional(UNIQUE),
    __,
    INDEX, // 5
    __,
    optional(CONCURRENTLY),
    __,
    optional(identifier),
    __, // 10
    ON,
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    optional(
      sequence([
        USING,
        __,
        or([keyword("hash" as any), keyword("btree" as any)]),
      ])
    ), // 15
    __,
    LPAREN,
    __,
    zeroToMany(sequence([identifier, __, COMMA])),
    __, // 20
    identifier,
    __, // 22
    RPAREN,
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      ...(v[9] ? { idxname: v[9] } : {}),
      relation: {
        relname: v[13].value,
        inh: true,
        relpersistence: "p",
        location: v[13].pos,
      },
      ...(v[15] ? { accessMethod: v[15][2] } : {}),
      accessMethod: v[15]?.[2].value === "hash" ? "hash" : "btree",
      indexParams: v[19]
        .map((i) => i[0])
        .concat(v[21])
        .map((j) => ({
          IndexElem: {
            name: j,
            ordering: "SORTBY_DEFAULT",
            nulls_ordering: "SORTBY_NULLS_DEFAULT",
          },
        })),
      ...(v[3] ? { unique: true } : {}),
      codeComment: combineComments(
        v[0],
        v[2],
        v[4],
        v[6],
        v[8],
        v[10],
        v[12],
        v[14],
        v[15]?.[1],
        v[16],
        v[18],
        v[20],
        v[22],
        v[24],
        v[25]
      ),
    };
  }
);
