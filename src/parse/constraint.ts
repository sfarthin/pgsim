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
// import { rawValue } from "./rawExpr";
import { aConst } from "./aConst";
import { funcCall } from "./funcCall";
import { typeCast } from "./typeCast";
import {
  DefaultConstraint,
  // ReferenceConstraint,
  UniqueConstraint,
  PrimaryKeyConstraint,
  NullConstraint,
  NotNullConstraint,
  ForeignKeyConstraint,
  ConType,
} from "../types";

export const defaultConstraint: Rule<{
  codeComment: string;
  value: DefaultConstraint;
}> = transform(
  sequence([DEFAULT, __, or([typeCast, funcCall, aConst])]),
  (value, ctx) => {
    return {
      codeComment: combineComments(value[1], value[2].codeComment),
      value: {
        contype: ConType.DEFAULT,
        location: ctx.pos,
        raw_expr: value[2].value,
      },
    };
  }
);

const referentialActionOption: Rule<{
  codeComment: string;
  value: "r" | "c" | "n" | "a" | "d";
}> = or([
  transform(RESTRICT, () => ({ value: "r", codeComment: "" })), // r
  transform(CASCADE, () => ({ value: "c", codeComment: "" })), // c
  transform(sequence([SET, __, NULL]), (v) => ({
    value: "n",
    codeComment: v[1],
  })), // n
  transform(sequence([NO, __, ACTION]), (v) => ({
    value: "a",
    codeComment: v[1],
  })), // a
  transform(sequence([SET, __, DEFAULT]), (v) => ({
    value: "d",
    codeComment: v[1],
  })), // d
]);

const referentialActions: Rule<{
  codeComment: string;
  value: {
    fk_del_action?: "a" | "r" | "c" | "n" | "d";
    fk_upd_action?: "a" | "r" | "c" | "n" | "d";
  };
}> = transform(
  or([
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
  ]),
  (v) => {
    const value: {
      fk_upd_action?: "a" | "r" | "c" | "n" | "d";
      fk_del_action?: "a" | "r" | "c" | "n" | "d";
    } = {};

    if (v[2].value === "UPDATE") {
      value.fk_upd_action = v[4].value;
    }

    if (v[2].value === "DELETE") {
      value.fk_del_action = v[4].value;
    }

    if (v[5]?.[3].value === "UPDATE") {
      value.fk_upd_action = v[5]?.[5].value;
    }

    if (v[5]?.[3].value === "DELETE") {
      value.fk_del_action = v[5]?.[5].value;
    }

    return {
      value,
      codeComment: combineComments(
        v[1],
        v[3],
        v[4].codeComment,
        v[5]?.[0],
        v[5]?.[2],
        v[5]?.[4],
        v[5]?.[5].codeComment
      ),
    };
  }
);

const foreignKeyConstraintExtended: Rule<{
  codeComment: string;
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
      inh: true,
      relname: v,
      relpersistence: "p" as const,
      location: ctx.pos,
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
      codeComment: combineComments(
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
        ...v[14]?.value,
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
  codeComment: string;
  value: ForeignKeyConstraint;
}> = transform(
  sequence([
    REFERENCES,
    __,
    transform(identifier, (v, ctx) => ({
      inh: true,
      relname: v,
      relpersistence: "p" as const,
      location: ctx.pos,
    })),
    __,
    optional(sequence([LPAREN, __, identifier, __, RPAREN])),
    __,
    optional(referentialActions),
  ]),
  (value, ctx) => {
    const pktable = value[2];
    const column = value[4]?.[2];
    return {
      codeComment: combineComments(
        value[1],
        value[3],
        value[4]?.[1],
        value[4]?.[3],
        value[5],
        value[6]?.codeComment
      ),
      value: {
        contype: ConType.FOREIGN_KEY,
        fk_del_action: "a",
        fk_matchtype: "s",
        fk_upd_action: "a",
        ...value[6]?.value,
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
  codeComment: string;
  value: NotNullConstraint;
}> = transform(sequence([NOT, __, NULL]), (value, ctx) => ({
  codeComment: value[1],
  value: { contype: ConType.NOT_NULL, location: ctx.pos },
}));

const nullConstraint: Rule<{
  codeComment: string;
  value: NullConstraint;
}> = transform(NULL, (_v, ctx) => ({
  codeComment: "",
  value: { contype: ConType.NULL, location: ctx.pos },
}));

const primaryKeyConstraint: Rule<{
  codeComment: string;
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
      codeComment: combineComments(
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
  codeComment: string;
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
    codeComment: "",
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
  codeComment: string;
}> = transform(
  sequence([
    zeroToMany(sequence([__, identifier, __, COMMA])),
    __,
    identifier,
    __,
  ]),
  (v) => {
    return {
      codeComment: combineComments(
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
    __,
    optional(referentialActions),
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
        inh: true,
        location: v[10].pos,
        relname: v[10].value,
        relpersistence: "p",
      },
      pk_attrs: v[12]?.[1].values.map((v) => ({ String: { str: v } })) ?? [],
      fk_attrs: v[5].values.map((v) => ({ String: { str: v } })) ?? [],
    };
  }
);

const primaryKeyTableConstraint: Rule<PrimaryKeyConstraint> = transform(
  sequence([PRIMARY, __, KEY, __, LPAREN, commaSeperatedIdentifiers, RPAREN]),
  (v, ctx) => {
    return {
      contype: ConType.PRIMARY_KEY,
      keys: v[5].values.map((k) => ({ String: { str: k } })),
      location: ctx.pos,
      codeComment: combineComments(v[1], v[3], v[5].codeComment),
    };
  }
);

export const tableConstraint = or([
  foreignKeyTableConstraint,
  primaryKeyTableConstraint,
]);
