import {
  exact,
  Decoder,
  number,
  constant,
  either3,
  string,
  boolean,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { PGString, stringDecoder } from "./constant";
import { tuple1 } from "./tuple1";

export enum ConType {
  "NotNull" = 1,
  "PrimaryKey" = 4,
  "Reference" = 7,
}

const notNullDecoder: Decoder<ConType.NotNull> = constant(ConType.NotNull);

const primaryKeyDecoder: Decoder<ConType.PrimaryKey> = constant(
  ConType.PrimaryKey
);

const referenceDecoder: Decoder<ConType.Reference> = constant(
  ConType.Reference
);

export type Constraint =
  | { contype: ConType.NotNull; location: number }
  | {
      contype: ConType.PrimaryKey;
      location: number;
    }
  | {
      contype: ConType.Reference;
      location: number;
      fk_upd_action: string;
      fk_del_action: string;
      fk_matchtype: string;
      initially_valid: boolean;
      pktable: {
        RangeVar: RangeVar;
      };
      pk_attrs: [PGString];
    };

export const constraintDecoder: Decoder<Constraint> = either3(
  exact({
    contype: notNullDecoder,
    location: number,
  }),
  exact({
    contype: primaryKeyDecoder,
    location: number,
  }),
  exact({
    contype: referenceDecoder,
    location: number,
    fk_upd_action: string,
    fk_del_action: string,
    fk_matchtype: string,
    initially_valid: boolean,
    pktable: exact({
      RangeVar: rangeVarDecoder,
    }),
    pk_attrs: tuple1(stringDecoder),
  })
);

export function isPrimaryKey(
  constraints: { Constraint: Constraint }[] | void
): boolean {
  if (!constraints) {
    return false;
  }

  for (const constraint of constraints) {
    if (constraint.Constraint.contype === ConType.PrimaryKey) {
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
    if (constraint.Constraint.contype === ConType.Reference) {
      const tablename = constraint.Constraint.pktable.RangeVar.relname;
      const colname = constraint.Constraint.pk_attrs[0].String.str;
      return { tablename, colname };
    }
  }

  return null;
}

export function isNullable(constraints: { Constraint: Constraint }[]): boolean {
  for (const constraint of constraints) {
    if (constraint.Constraint.contype === ConType.NotNull) {
      return false;
    }
  }

  return true;
}
