import { optional, number, exact, Decoder, array, mixed } from "decoders";
import { PGString, stringDecoder, A_Const, aConstDecoder } from "./constant";
import { tuple1 } from "./tuple1";

export type TypeName = {
  names: PGString[];
  typemod: number;
  typmods: [{ A_Const: A_Const }] | void;
  location: number;
  arrayBounds?: unknown; // create table gin_test_tbl(i int4[]) with (autovacuum_enabled = off);
};

export const typeNameDecoder: Decoder<TypeName> = exact({
  names: array(stringDecoder),
  typemod: number,
  typmods: optional(tuple1(exact({ A_Const: aConstDecoder }))),
  location: number,
  arrayBounds: optional(mixed),
});

export type TypeCast = {
  arg: unknown; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
  typeName: {
    TypeName: TypeName;
  };
  location: number;
};

export const typeCastDecoder: Decoder<TypeCast> = exact({
  arg: mixed,
  typeName: exact({ TypeName: typeNameDecoder }),
  location: number,
});
