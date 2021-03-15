import { exact, Decoder } from "decoders";
import { Location, locationDecoder } from "./location";
import { typeNameDecoder, TypeName } from "./typeName";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type TypeCast = {
  arg?: RawValue;
  typeName: {
    TypeName: TypeName;
  };
  location: Location;
};

export const typeCastDecoder: Decoder<TypeCast> = exact({
  arg: (blob) => rawValueDecoder(blob),
  typeName: exact({ TypeName: typeNameDecoder }),
  location: locationDecoder,
});
