import * as d from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { String, stringDecoder } from "./constant";
import { RawValue, rawValueDecoder } from "./rawExpr";
import { Location, locationDecoder } from "./location";

export enum ConType {
  NULL = "CONSTR_NULL",
  NOT_NULL = "CONSTR_NOTNULL",
  DEFAULT = "CONSTR_DEFAULT",
  CHECK = "CONSTR_CHECK",
  PRIMARY_KEY = "CONSTR_PRIMARY",
  UNIQUE = "CONSTR_UNIQUE",
  EXCLUSION = "CONSTR_EXCLUSION",
  FOREIGN_KEY = "CONSTR_FOREIGN",
  DEFERRABLE = "CONSTR_ATTR_DEFERRABLE",
  NOT_DEFERRABLE = "CONSTR_ATTR_NOT_DEFERRABLE",
  DEFERRED = "CONSTR_ATTR_DEFERRED",
  IMMEDIATE = "CONSTR_ATTR_IMMEDIATE",
}

/**
 * Null
 */

export type NullConstraint = {
  contype: ConType.NULL;
  location: Location;
};

export const nullConstraintDecoder: d.Decoder<NullConstraint> = d.exact({
  contype: d.constant(ConType.NULL),
  location: locationDecoder,
});

/**
 * Primary Key
 */
export type PrimaryKeyConstraint = {
  contype: ConType.PRIMARY_KEY;
  location: Location;
  conname?: string;
  keys?: { String: String }[];
  codeComment?: string;
};

export const primaryKeyConstraintDecoder: d.Decoder<PrimaryKeyConstraint> =
  d.exact({
    contype: d.constant(ConType.PRIMARY_KEY),
    location: locationDecoder,
    conname: d.optional(d.string),
    keys: d.optional(d.array(stringDecoder)),
  });

/**
 * Not Null
 */
export type NotNullConstraint = {
  contype: ConType.NOT_NULL;
  location: Location;
};

export const notNullConstraintDecoder: d.Decoder<NotNullConstraint> = d.exact({
  contype: d.constant(ConType.NOT_NULL) as d.Decoder<ConType.NOT_NULL>,
  location: locationDecoder,
});

/**
 * Default
 */
export type DefaultConstraint = {
  contype: ConType.DEFAULT;
  location: Location;
  raw_expr: RawValue;
};

export const defaultConstraintDecoder: d.Decoder<DefaultConstraint> = d.exact({
  contype: d.constant(ConType.DEFAULT) as d.Decoder<ConType.DEFAULT>,
  location: locationDecoder,
  raw_expr: (blob) => rawValueDecoder(blob),
});

/**
 * Unique
 */

export type UniqueConstraint = {
  contype: ConType.UNIQUE;
  location: Location;
  conname?: string;
  keys?: { String: String }[];
};

export const uniqueConstraintDecoder = d.exact({
  contype: d.constant(ConType.UNIQUE) as d.Decoder<ConType.UNIQUE>,
  location: locationDecoder,
  conname: d.optional(d.string),
  keys: d.optional(d.tuple1(stringDecoder)),
});

/**
 * Foreign Key
 */

export type ForeignKeyConstraint = {
  contype: ConType.FOREIGN_KEY;
  location: Location;
  fk_upd_action?: "r" | "c" | "n" | "a" | "d";
  fk_del_action?: "r" | "c" | "n" | "a" | "d";
  fk_matchtype?: string;
  pktable: RangeVar;
  pk_attrs?: { String: String }[];
  conname?: string;
  fk_attrs?: { String: String }[];
  codeComment?: string;
  skip_validation?: true; // <-- NOT VALID
  initially_valid?: boolean; // <-- if NOT VALID is not specified, this is usually defined as true.
};

const actionDecoders = d.either5(
  d.constant("r"),
  d.constant("c"),
  d.constant("n"),
  d.constant("a"),
  d.constant("d")
);

export const foreignKeyConstraint: d.Decoder<ForeignKeyConstraint> = d.exact({
  contype: d.constant(ConType.FOREIGN_KEY),
  location: locationDecoder,
  fk_upd_action: d.optional(actionDecoders),
  fk_del_action: d.optional(actionDecoders),
  fk_matchtype: d.string,
  initially_valid: d.optional(d.boolean),
  pktable: rangeVarDecoder,
  pk_attrs: d.optional(d.array(stringDecoder)),
  conname: d.optional(d.string),
  fk_attrs: d.optional(d.array(stringDecoder)),
  skip_validation: d.optional(d.constant(true)),
});

/**
 * Reference Key
 */

export type ReferenceConstraint = {
  contype: ConType.EXCLUSION;
  location: Location;
  fk_upd_action?: string;
  fk_del_action?: string;
  fk_matchtype?: string;
  initially_valid: boolean;
  pktable: {
    RangeVar: RangeVar;
  };
  pk_attrs?: { String: String }[];
  conname?: string;
  fk_attrs?: { String: String }[];
  codeComment?: string;
};

export const referenceConstraint: d.Decoder<ReferenceConstraint> = d.exact({
  contype: d.constant(ConType.EXCLUSION),
  location: locationDecoder,
  fk_upd_action: d.string,
  fk_del_action: d.string,
  fk_matchtype: d.string,
  initially_valid: d.boolean,
  pktable: d.exact({
    RangeVar: rangeVarDecoder,
  }),
  pk_attrs: d.optional(d.array(stringDecoder)),
  conname: d.optional(d.string),
  fk_attrs: d.optional(d.array(stringDecoder)),
});

/**
 * Check Constraint
 */

export type CheckConstraint = {
  contype: ConType.CHECK;
  conname: string;
  location: Location;
  raw_expr: RawValue;
  skip_validation?: boolean;
  initially_valid?: boolean;
};

export const CheckConstraintDecoder: d.Decoder<CheckConstraint> = d.exact({
  contype: d.constant(ConType.CHECK),
  conname: d.string,
  location: locationDecoder,
  raw_expr: rawValueDecoder,
  skip_validation: d.optional(d.boolean),
  initially_valid: d.optional(d.boolean),
});

export type Constraint =
  | NullConstraint
  | NotNullConstraint
  | DefaultConstraint
  | UniqueConstraint
  | PrimaryKeyConstraint
  | ForeignKeyConstraint
  | ReferenceConstraint
  | CheckConstraint;

export const constraintDecoder: d.Decoder<Constraint> = d.dispatch("contype", {
  [ConType.NULL]: nullConstraintDecoder,
  [ConType.NOT_NULL]: notNullConstraintDecoder,
  [ConType.DEFAULT]: defaultConstraintDecoder,
  [ConType.UNIQUE]: uniqueConstraintDecoder,
  [ConType.PRIMARY_KEY]: primaryKeyConstraintDecoder,
  [ConType.EXCLUSION]: referenceConstraint,
  [ConType.FOREIGN_KEY]: foreignKeyConstraint,
  [ConType.CHECK]: CheckConstraintDecoder,
});

export function isPrimaryKey(
  constraints: { Constraint: Constraint }[] | void
): boolean {
  if (!constraints) {
    return false;
  }

  for (const constraint of constraints) {
    if (constraint.Constraint.contype === ConType.PRIMARY_KEY) {
      return true;
    }
  }

  return false;
}

// export function getReference(
//   constraints: { Constraint: Constraint }[]
// ): { tablename: string; colname: string } | null {
//   if (!constraints) {
//     return null;
//   }

//   for (const constraint of constraints) {
//     if (constraint.Constraint.contype === ConType.REFERENCE) {
//       const tablename = constraint.Constraint.pktable.RangeVar.relname;
//       const colname = constraint.Constraint.pk_attrs?.[0].String.str;

//       if (!colname) {
//         throw new Error("Unsure of of reference");
//       }
//       return { tablename, colname };
//     }
//   }

//   return null;
// }

export function isNullable(constraints: { Constraint: Constraint }[]): boolean {
  for (const constraint of constraints) {
    if (constraint.Constraint.contype === ConType.NOT_NULL) {
      return false;
    }
  }

  return true;
}
