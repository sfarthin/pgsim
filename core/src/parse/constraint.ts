import { optional, array, string, object, Decoder, number } from "decoders";

export enum ConType {
  "isNotNull" = 1,
  "isPrimaryKey" = 4,
}

export type Constraint = {
  contype: number;
  location: number;
  fk_upd_action: string | undefined;
  fk_del_action: string | undefined;
  pktable:
    | {
        RangeVar: {
          relname: string;
          inhOpt: number;
          relpersistence: string;
          location: number;
        };
      }
    | undefined;
  pk_attrs:
    | Array<{
        String: {
          str: string;
        };
      }>
    | undefined;
};

export const constraintDecoder: Decoder<Constraint> = object({
  contype: number,
  location: number,
  fk_upd_action: optional(string),
  fk_del_action: optional(string),
  pktable: optional(
    object({
      RangeVar: object({
        relname: string,
        inhOpt: number,
        relpersistence: string,
        location: number,
      }),
    })
  ),
  pk_attrs: optional(
    array(
      object({
        String: object({
          str: string,
        }),
      })
    )
  ),
});

export function isPrimaryKey(
  constraints: { Constraint: Constraint }[] | void
): boolean {
  if (!constraints) {
    return false;
  }

  for (let constraint of constraints) {
    if (constraint.Constraint.contype === ConType.isPrimaryKey) {
      return true;
    }
  }

  return false;
}

export function getReference(
  constraints: { Constraint: Constraint }[] | void
): { tablename: string; colname: string } | null {
  if (!constraints) {
    return null;
  }

  for (let constraint of constraints) {
    const tablename = constraint.Constraint?.pktable?.RangeVar?.relname ?? "";
    const colname = constraint.Constraint?.pk_attrs?.[0]?.String?.str ?? "";
    if (tablename && colname) {
      return { tablename, colname };
    }
  }

  return null;
}

export function isNullable(
  constraints: { Constraint: Constraint }[] | void
): boolean {
  if (!constraints) {
    return true;
  }

  for (let constraint of constraints) {
    if (constraint.Constraint.contype === ConType.isNotNull) {
      return false;
    }
  }

  return true;
}
