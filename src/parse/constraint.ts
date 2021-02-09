import {
  identifier,
  transform,
  Rule,
  combineComments,
  or,
  DEFAULT,
  REFERENCES,
  LPAREN,
  optional,
  RPAREN,
  UNIQUE,
  PRIMARY,
  NULL,
  KEY,
  NOT,
  sequence,
  FOREIGN,
  __,
  COMMA,
  zeroToMany,
  CONSTRAINT,
  RESTRICT,
  CASCADE,
  SET,
  NO,
  ACTION,
  ON,
  DELETE,
  UPDATE,
} from "./util";
import { rawExpr } from "./rawExpr";
import {
  DefaultConstraint,
  ReferenceConstraint,
  UniqueConstraint,
  PrimaryKeyConstraint,
  NullConstraint,
  NotNullConstraint,
  ForeignKeyConstraint,
  ConType,
} from "../types";

const defaultConstraint: Rule<{
  comment: string;
  value: DefaultConstraint;
}> = transform(sequence([DEFAULT, __, rawExpr]), (value, ctx) => {
  return {
    comment: combineComments(value[1], value[2].comment),
    value: {
      contype: ConType.DEFAULT,
      location: ctx.pos,
      raw_expr: { ...value[2], comment: undefined },
    },
  };
});

const referentialActionOption = or([
  RESTRICT,
  CASCADE,
  sequence([SET, __, NULL]),
  sequence([NO, __, ACTION]),
  sequence([SET, __, DEFAULT]),
]);

const referentialActions = or([
  sequence([
    ON,
    __,
    UPDATE,
    __,
    referentialActionOption,
    optional(sequence([__, ON, __, DELETE, __, referentialActionOption])),
  ]),
  sequence([
    ON,
    __,
    DELETE,
    __,
    referentialActionOption,
    optional(sequence([__, ON, __, UPDATE, __, referentialActionOption])),
  ]),
]);

const foreignKeyConstraintExtended: Rule<{
  comment: string;
  value: ForeignKeyConstraint;
}> = transform(
  sequence([
    optional(sequence([CONSTRAINT, __, identifier])),
    __,
    FOREIGN,
    __,
    KEY,
    __, // 5
    optional(
      sequence([
        LPAREN,
        __,
        identifier,
        zeroToMany(sequence([__, COMMA, __, identifier])),
        __,
        RPAREN,
      ])
    ),
    __,
    REFERENCES,
    __,
    transform(identifier, (v, ctx) => ({
      RangeVar: {
        inh: true,
        relname: v,
        relpersistence: "p" as const,
        location: ctx.pos,
      },
    })), // 10
    __,
    optional(
      sequence([
        LPAREN,
        __,
        identifier,
        zeroToMany(sequence([__, COMMA, __, identifier])),
        __,
        RPAREN,
      ])
    ),
    __,
    optional(referentialActions),
  ]),
  (v, ctx) => {
    return {
      comment: combineComments(
        v[0]?.[1],
        v[1],
        v[3],
        v[5],
        v[6]?.[1],
        ...(v[6]?.[3]?.map((k) => combineComments(k[0], k[2])) ?? []),
        v[6]?.[4],
        v[7],
        v[9],
        v[11],
        v[12]?.[1],
        ...(v[12]?.[3]?.map((k) => combineComments(k[0], k[2])) ?? []),
        v[12]?.[4],
        v[13]
      ),
      value: {
        contype: ConType.FOREIGN_KEY,
        location: ctx.pos,
        ...(v[0] ? { conname: v[0][2] } : {}),
        initially_valid: true,
        fk_del_action: "a",
        fk_matchtype: "s",
        fk_upd_action: "a",
        // initially_valid: true,
        pktable: v[10],
        ...(v[12]
          ? {
              pk_attrs: [v[12]?.[2]]
                .concat(v[12]?.[3].map((k) => k[3]))
                .map((str) => ({
                  String: {
                    str,
                  },
                })),
            }
          : {}),
        ...(v[6]
          ? {
              fk_attrs: [v[6]?.[2]]
                .concat(v[6]?.[3].map((k) => k[3]))
                .map((str) => ({
                  String: {
                    str,
                  },
                })),
            }
          : {}),
      },
    };
  }
);

const foreignKeyConstraint: Rule<{
  comment: string;
  value: ForeignKeyConstraint;
}> = transform(
  sequence([
    REFERENCES,
    __,
    transform(identifier, (v, ctx) => ({
      RangeVar: {
        inh: true,
        relname: v,
        relpersistence: "p" as const,
        location: ctx.pos,
      },
    })),
    __,
    optional(sequence([LPAREN, __, identifier, __, RPAREN])),
  ]),
  (value, ctx) => {
    const pktable = value[2];
    const column = value[4]?.[2];
    return {
      comment: combineComments(
        value[1],
        value[3],
        value[4]?.[1],
        value[4]?.[3]
      ),
      value: {
        contype: ConType.FOREIGN_KEY,
        fk_del_action: "a",
        fk_matchtype: "s",
        fk_upd_action: "a",
        initially_valid: true,
        ...(column
          ? {
              pk_attrs: [
                {
                  String: {
                    str: column,
                  },
                },
              ],
            }
          : {}),
        pktable,
        location: ctx.pos,
      },
    };
  }
);

const notNullConstraint: Rule<{
  comment: string;
  value: NotNullConstraint;
}> = transform(sequence([NOT, __, NULL]), (value, ctx) => ({
  comment: value[1],
  value: { contype: ConType.NOT_NULL, location: ctx.pos },
}));

const nullConstraint: Rule<{
  comment: string;
  value: NullConstraint;
}> = transform(NULL, (v, ctx) => ({
  comment: "",
  value: { contype: ConType.NULL, location: ctx.pos },
}));

const primaryKeyConstraint: Rule<{
  comment: string;
  value: PrimaryKeyConstraint;
}> = transform(
  sequence([
    optional(sequence([CONSTRAINT, __, identifier])),
    __,
    PRIMARY,
    __,
    KEY,
    __,
    optional(
      sequence([
        LPAREN,
        __,
        identifier,
        zeroToMany(sequence([__, COMMA, __, identifier])),
        __,
        RPAREN,
      ])
    ),
  ]),
  (value, ctx) => {
    return {
      comment: combineComments(
        value[0]?.[1],
        value[1],
        value[3],
        value[5],
        value[6]?.[1],
        ...(value[6]
          ? value[6][3].map((k) => combineComments(k[0], k[2]))
          : []),
        value[6]?.[4]
      ),
      value: {
        contype: ConType.PRIMARY_KEY,
        ...(value[0] ? { conname: value[0][2] } : {}),
        location: ctx.pos,
        ...(value[6]
          ? {
              keys: [
                { String: { str: value[6][2] } },
                ...value[6]?.[3].map((k) => ({
                  String: {
                    str: k[3],
                  },
                })),
              ],
            }
          : {}),
      },
    };
  }
);

const uniqueConstrant: Rule<{
  comment: string;
  value: UniqueConstraint;
}> = transform(
  sequence([
    optional(sequence([CONSTRAINT, __, identifier])),
    __,
    UNIQUE,
    __,
    optional(
      sequence([
        LPAREN,
        __,
        identifier,
        zeroToMany(sequence([__, COMMA, __, identifier])),
        __,
        RPAREN,
      ])
    ),
  ]),
  (v, ctx) => ({
    comment: "",
    value: {
      contype: ConType.UNIQUE,
      location: ctx.pos,
      ...(v[0] ? { conname: v[0][2] } : {}),
      ...(v[4]
        ? {
            keys: [
              { String: { str: v[4][2] } },
              ...v[4]?.[3].map((k) => ({
                String: {
                  str: k[3],
                },
              })),
            ],
          }
        : {}),
    },
  })
);

export const constraint = or([
  notNullConstraint,
  nullConstraint,
  primaryKeyConstraint,
  uniqueConstrant,
  defaultConstraint,
  foreignKeyConstraintExtended,
  foreignKeyConstraint,
]);

// ForeignKeyConstraint

const commaSeperatedIdentifiers: Rule<{
  values: string[];
  comment: string;
}> = transform(
  sequence([
    zeroToMany(sequence([__, identifier, __, COMMA])),
    __,
    identifier,
    __,
  ]),
  (v) => {
    return {
      comment: combineComments(
        ...v[0].map((e) => combineComments(e[0], e[2])),
        v[1],
        v[3]
      ),
      values: [...v[0].map((e) => e[1]), v[2]],
    };
  }
);

const foreignKeyTableConstraint: Rule<ForeignKeyConstraint> = transform(
  sequence([
    FOREIGN,
    __,
    KEY,
    __,
    LPAREN,
    commaSeperatedIdentifiers,
    RPAREN,
    __,
    REFERENCES,
    __,
    transform(identifier, (v, ctx) => ({ value: v, pos: ctx.pos })),
    __,
    optional(sequence([LPAREN, commaSeperatedIdentifiers, RPAREN])),
  ]),
  (v, ctx) => {
    return {
      contype: ConType.FOREIGN_KEY,
      location: ctx.pos,
      fk_del_action: "a",
      fk_matchtype: "s",
      fk_upd_action: "a",
      initially_valid: true,
      pktable: {
        RangeVar: {
          inh: true,
          location: v[10].pos,
          relname: v[10].value,
          relpersistence: "p",
        },
      },
      pk_attrs: v[12]?.[1].values.map((v) => ({ String: { str: v } })) ?? [],
      fk_attrs: v[5].values.map((v) => ({ String: { str: v } })) ?? [],
    };
  }
);

// // ForeignKeyTableConstraint = c1:FOREIGN_KEY csi:CommaSeperatedIdentifiersInParens c2:REFERENCES otherTable:Identifier csi2:CommaSeperatedIdentifiersInParens? {
//   return {
//     Constraint: {
//         comment: combineComments(c1.comment, csi.comment, c2.comment)
//     }
// }
// }

export const tableConstraint = or([foreignKeyTableConstraint]);
