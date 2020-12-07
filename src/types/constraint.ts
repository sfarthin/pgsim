import {
  exact,
  Decoder,
  constant,
  either6,
  string,
  boolean,
  optional,
  array,
  either,
  unknown,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { PGString, stringDecoder } from "./constant";
import { tuple1 } from "./tuple1";
import { TargetValue, targetValueDecoder } from "./targetValue";
import { Location, locationDecoder } from "./location";

export enum ConType {
  NOT_NULL = 1,
  DEFAULT = 2,
  CHECK = 4,
  PRIMARY_KEY = 5,
  UNIQUE = 6,
  REFERENCE = 7,
  FOREIGN_KEY = 8,
}

/**
 * Primary Key
 */
export type PrimaryKeyConstraint = {
  contype: ConType.PRIMARY_KEY;
  location: Location;
  conname?: string;
  keys?: PGString[];
};

export const primaryKeyConstraintDecoder: Decoder<PrimaryKeyConstraint> = exact(
  {
    contype: constant(ConType.PRIMARY_KEY) as Decoder<ConType.PRIMARY_KEY>,
    location: locationDecoder,
    conname: optional(string),
    keys: optional(array(stringDecoder)),
  }
);

/**
 * Not Null
 */
export type NotNullConstraint = {
  contype: ConType.NOT_NULL;
  location: Location;
};

export const notNullConstraintDecoder: Decoder<NotNullConstraint> = exact({
  contype: constant(ConType.NOT_NULL) as Decoder<ConType.NOT_NULL>,
  location: locationDecoder,
});

/**
 * Default
 */
export type DefaultConstraint = {
  contype: ConType.DEFAULT;
  location: Location;
  raw_expr: TargetValue;
};

export const defaultConstraintDecoder: Decoder<DefaultConstraint> = exact({
  contype: constant(ConType.DEFAULT) as Decoder<ConType.DEFAULT>,
  location: locationDecoder,
  raw_expr: targetValueDecoder,
});

/**
 * Unique
 */

export type UniqueConstraint = {
  contype: ConType.UNIQUE;
  location: Location;
  conname?: string;
  keys?: [PGString];
};

export const uniqueConstraintDecoder = exact({
  contype: constant(ConType.UNIQUE) as Decoder<ConType.UNIQUE>,
  location: locationDecoder,
  conname: optional(string),
  keys: optional(tuple1(stringDecoder)),
});

/**
 * Foreign Key
 */

export type ForeignKeyConstraint = {
  contype: ConType.REFERENCE | ConType.FOREIGN_KEY;
  location: Location;
  fk_upd_action: string;
  fk_del_action: string;
  fk_matchtype: string;
  initially_valid: boolean;
  pktable: {
    RangeVar: RangeVar;
  };
  pk_attrs?: [PGString];
  conname?: unknown;
  fk_attrs?: unknown;
};

export const foreignKeyConstraint: Decoder<ForeignKeyConstraint> = exact({
  contype: either(
    constant(ConType.REFERENCE) as Decoder<ConType.REFERENCE>,
    constant(ConType.FOREIGN_KEY) as Decoder<ConType.FOREIGN_KEY>
  ),
  location: locationDecoder,
  fk_upd_action: string,
  fk_del_action: string,
  fk_matchtype: string,
  initially_valid: boolean,
  pktable: exact({
    RangeVar: rangeVarDecoder,
  }),
  pk_attrs: optional(tuple1(stringDecoder)),
  conname: unknown,
  fk_attrs: unknown,
});

/**
 * Check Constraint
 */

export type CheckConstraint = {
  contype: ConType.CHECK;
  conname: string;
  location: Location;
  raw_expr: TargetValue;
  skip_validation?: boolean;
  initially_valid?: boolean;
};

export const CheckConstraintDecoder: Decoder<CheckConstraint> = exact({
  contype: constant(ConType.CHECK) as Decoder<ConType.CHECK>,
  conname: string,
  location: locationDecoder,
  raw_expr: targetValueDecoder,
  skip_validation: optional(boolean),
  initially_valid: optional(boolean),
});

export type Constraint =
  | NotNullConstraint
  | DefaultConstraint
  | UniqueConstraint
  | PrimaryKeyConstraint
  | ForeignKeyConstraint
  | CheckConstraint;

export const constraintDecoder: Decoder<Constraint> = either6(
  notNullConstraintDecoder,
  defaultConstraintDecoder,
  uniqueConstraintDecoder,
  primaryKeyConstraintDecoder,
  foreignKeyConstraint,
  CheckConstraintDecoder
);

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

export function getReference(
  constraints: { Constraint: Constraint }[]
): { tablename: string; colname: string } | null {
  if (!constraints) {
    return null;
  }

  for (const constraint of constraints) {
    if (constraint.Constraint.contype === ConType.REFERENCE) {
      const tablename = constraint.Constraint.pktable.RangeVar.relname;
      const colname = constraint.Constraint.pk_attrs?.[0].String.str;

      if (!colname) {
        throw new Error("Unsure of of reference");
      }
      return { tablename, colname };
    }
  }

  return null;
}

export function isNullable(constraints: { Constraint: Constraint }[]): boolean {
  for (const constraint of constraints) {
    if (constraint.Constraint.contype === ConType.NOT_NULL) {
      return false;
    }
  }

  return true;
}
