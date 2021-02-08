import {
  exact,
  Decoder,
  constant,
  string,
  boolean,
  optional,
  array,
  unknown,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { PGString, stringDecoder } from "./constant";
import { tuple1 } from "./tuple1";
import { TargetValue, targetValueDecoder } from "./targetValue";
import { RawExpr, rawExprDecoder } from "./rawExpr";
import { Location, locationDecoder } from "./location";
import { dispatchByField } from "./dispatch";

export enum ConType {
  NULL = 0,
  NOT_NULL = 1,
  DEFAULT = 2,
  CHECK = 4,
  PRIMARY_KEY = 5,
  UNIQUE = 6,
  REFERENCE = 7,
  FOREIGN_KEY = 8,
}

/**
 * Null
 */

export type NullConstraint = {
  contype: ConType.NULL;
  location: Location;
};

export const nullConstraintDecoder: Decoder<NullConstraint> = exact({
  contype: constant(ConType.NULL) as Decoder<ConType.NULL>,
  location: locationDecoder,
});

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
  raw_expr: RawExpr;
};

export const defaultConstraintDecoder: Decoder<DefaultConstraint> = exact({
  contype: constant(ConType.DEFAULT) as Decoder<ConType.DEFAULT>,
  location: locationDecoder,
  raw_expr: (blob) => rawExprDecoder(blob),
});

/**
 * Unique
 */

export type UniqueConstraint = {
  contype: ConType.UNIQUE;
  location: Location;
  conname?: string;
  keys?: PGString[];
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
  contype: ConType.FOREIGN_KEY;
  location: Location;
  fk_upd_action: string;
  fk_del_action: string;
  fk_matchtype: string;
  initially_valid: boolean;
  pktable: {
    RangeVar: RangeVar;
  };
  pk_attrs?: PGString[];
  conname?: unknown;
  fk_attrs?: PGString[];
  comment?: string;
};

export const foreignKeyConstraint: Decoder<ForeignKeyConstraint> = exact({
  contype: constant(ConType.FOREIGN_KEY) as Decoder<ConType.FOREIGN_KEY>,
  location: locationDecoder,
  fk_upd_action: string,
  fk_del_action: string,
  fk_matchtype: string,
  initially_valid: boolean,
  pktable: exact({
    RangeVar: rangeVarDecoder,
  }),
  pk_attrs: optional(array(stringDecoder)),
  conname: unknown,
  fk_attrs: optional(array(stringDecoder)),
});

/**
 * Reference Key
 */

export type ReferenceConstraint = {
  contype: ConType.REFERENCE;
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

export const referenceConstraint: Decoder<ReferenceConstraint> = exact({
  contype: constant(ConType.REFERENCE) as Decoder<ConType.REFERENCE>,
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
  | NullConstraint
  | NotNullConstraint
  | DefaultConstraint
  | UniqueConstraint
  | PrimaryKeyConstraint
  | ForeignKeyConstraint
  | ReferenceConstraint
  | CheckConstraint;

export const constraintDecoder: Decoder<Constraint> = dispatchByField(
  "contype",
  {
    [ConType.NULL]: nullConstraintDecoder,
    [ConType.NOT_NULL]: notNullConstraintDecoder,
    [ConType.DEFAULT]: defaultConstraintDecoder,
    [ConType.UNIQUE]: uniqueConstraintDecoder,
    [ConType.PRIMARY_KEY]: primaryKeyConstraintDecoder,
    [ConType.REFERENCE]: referenceConstraint,
    [ConType.FOREIGN_KEY]: foreignKeyConstraint,
    [ConType.CHECK]: CheckConstraintDecoder,
  }
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
