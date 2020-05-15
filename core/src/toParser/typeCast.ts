import { optional, number, exact, Decoder, array, mixed } from "decoders";
import { PGString, stringDecoder, A_Const, aConstDecoder } from "./constant";
import { tuple1 } from "./tuple1";

export type TypeName = {
  names: PGString[];
  typemod: number;
  typmods: [{ A_Const: A_Const }] | void;
  location: number;
};

export const typeNameDecoder: Decoder<TypeName> = exact({
  names: array(stringDecoder),
  typemod: number,
  typmods: optional(tuple1(exact({ A_Const: aConstDecoder }))),
  location: number,
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
