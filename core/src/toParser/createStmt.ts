import {
  optional,
  array,
  string,
  object,
  Decoder,
  number,
  boolean,
} from "decoders";
import { Constraint, constraintDecoder } from "./constraint";

export type TypeName = {
  names: Array<{
    String: { str: string };
  }>;
  typemod: number;
  location: number;
};

export const typeNameDecoder: Decoder<TypeName> = object({
  names: array(
    object({
      String: object({ str: string }),
    })
  ),
  typemod: number,
  location: number,
});

export type ColumnDef = {
  colname: string;
  typeName: { TypeName: TypeName };
  constraints: Array<{ Constraint: Constraint }> | void;
  is_local: boolean;
  location: number;
};

export const columnDefDecoder: Decoder<ColumnDef> = object({
  colname: string,
  typeName: object({ TypeName: typeNameDecoder }),
  constraints: optional(array(object({ Constraint: constraintDecoder }))),
  is_local: boolean,
  location: number,
});

export type Relation = {
  RangeVar: {
    relname: string;
    // 0 = No, 1 = Yes, 2 = Default
    // https://docs.huihoo.com/doxygen/postgresql/primnodes_8h.html#a3a00c823fb80690cdf8373d6cb30b9c8
    inhOpt: number;
    // p = permanent table, u = unlogged table, t = temporary table
    relpersistence: string;
    location: number;
  };
};

export const relationDecoder = object({
  RangeVar: object({
    relname: string,
    inhOpt: number,
    relpersistence: string,
    location: number,
  }),
});

export type CreateStmt = {
  relation: Relation;
  tableElts: Array<{ ColumnDef: ColumnDef }>;
  oncommit: number;
};

export const createStmtDecoder = object({
  relation: relationDecoder,
  tableElts: array(object({ ColumnDef: columnDefDecoder })),
  oncommit: number,
});
