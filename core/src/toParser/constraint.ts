import {
  exact,
  Decoder,
  number,
  constant,
  either5,
  string,
  boolean,
  optional,
  array,
  object,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";
import { PGString, stringDecoder, A_Const, aConstDecoder } from "./constant";
import { tuple1 } from "./tuple1";

export enum ConType {
  "NotNull" = 1,
  "Default" = 2,
  "PrimaryKey" = 4,
  "Unique" = 5,
  "Reference" = 7,
}

const notNullDecoder: Decoder<ConType.NotNull> = constant(ConType.NotNull);
const defaultDecoder: Decoder<ConType.Default> = constant(ConType.Default);
const uniqueDecoder: Decoder<ConType.Unique> = constant(ConType.Unique);

const primaryKeyDecoder: Decoder<ConType.PrimaryKey> = constant(
  ConType.PrimaryKey
);

const referenceDecoder: Decoder<ConType.Reference> = constant(
  ConType.Reference
);

export type Constraint =
  | { contype: ConType.NotNull; location: number }
  | {
      contype: ConType.Default;
      location: number;
      raw_expr: {
        A_Const: A_Const;
      };
    }
  | { contype: ConType.Unique; location: number }
  | {
      contype: ConType.PrimaryKey;
      location: number;
      conname?: string;
      keys?: PGString[];
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
// | {
//     contype: 6;
//     access_method: unknown;
//     exclusions: unknown;
//     location: number;
//   };

export const constraintDecoder: Decoder<Constraint> = either5(
  exact({
    contype: notNullDecoder,
    location: number,
  }),

  exact({
    contype: defaultDecoder,
    location: number,
    raw_expr: object({ A_Const: aConstDecoder }),
  }),

  exact({
    contype: uniqueDecoder,
    location: number,
  }),
  exact({
    contype: primaryKeyDecoder,
    location: number,
    conname: optional(string),
    keys: optional(array(stringDecoder)),
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
  // exact({
  //   contype: constant(6),
  //   access_method: mixed,
  //   exclusions: mixed,
  //   location: number,
  // })
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
