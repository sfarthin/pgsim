import {
  optional,
  number,
  exact,
  Decoder,
  array,
  unknown,
  either,
} from "decoders";
import { PGString, stringDecoder, A_Const, aConstDecoder } from "./constant";
import { tuple1, tuple2 } from "./tuple1";
import { Location, locationDecoder } from "./location";

export type TypeName = {
  names: PGString[];
  typemod: number;
  typmods?:
    | [{ A_Const: A_Const }]
    | [{ A_Const: A_Const }, { A_Const: A_Const }];
  location: Location;
  arrayBounds?: unknown; // create table gin_test_tbl(i int4[]) with (autovacuum_enabled = off);
};

export const typeNameDecoder: Decoder<TypeName> = exact({
  names: array(stringDecoder),
  typemod: number,
  typmods: optional(
    either(
      tuple1(exact({ A_Const: aConstDecoder })),
      tuple2(exact({ A_Const: aConstDecoder }))
    )
  ),
  location: locationDecoder,
  arrayBounds: unknown,
});

export type TypeCast = {
  arg?: unknown; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
  typeName: {
    TypeName: TypeName;
  };
  location: Location;
};

export const typeCastDecoder: Decoder<TypeCast> = exact({
  arg: unknown,
  typeName: exact({ TypeName: typeNameDecoder }),
  location: locationDecoder,
});
