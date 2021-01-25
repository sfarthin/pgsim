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
} from "~/types";

const defaultConstraint: Rule<{
  comment: string;
  value: DefaultConstraint;
}> = transform(sequence([DEFAULT, __, rawExpr]), (value, ctx) => {
  return {
    comment: value[1],
    value: { contype: 2, location: ctx.pos, raw_expr: value[2] },
  };
});

const referencesConstraint: Rule<{
  comment: string;
  value: ReferenceConstraint;
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
        contype: 8,
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
  value: { contype: 1, location: ctx.pos },
}));

const nullConstraint: Rule<{
  comment: string;
  value: NullConstraint;
}> = transform(NULL, (v, ctx) => ({
  comment: "",
  value: { contype: 0, location: ctx.pos },
}));

const primaryKeyConstraint: Rule<{
  comment: string;
  value: PrimaryKeyConstraint;
}> = transform(sequence([PRIMARY, __, KEY]), (value, ctx) => ({
  comment: value[1],
  value: { contype: 5, location: ctx.pos },
}));

const uniqueConstrant: Rule<{
  comment: string;
  value: UniqueConstraint;
}> = transform(UNIQUE, (v, ctx) => ({
  comment: "",
  value: { contype: 6, location: ctx.pos },
}));

export const constraint = or([
  notNullConstraint,
  nullConstraint,
  primaryKeyConstraint,
  uniqueConstrant,
  defaultConstraint,
  referencesConstraint,
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
