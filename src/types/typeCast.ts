import { exact, Decoder } from "decoders";
import { Location, locationDecoder } from "./location";
import { typeNameDecoder, TypeName } from "./typeName";
import { A_Const, aConstDecoder } from "./constant";

export type TypeCast = {
  arg?: { A_Const: A_Const }; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
  typeName: {
    TypeName: TypeName;
  };
  location: Location;
};

export const typeCastDecoder: Decoder<TypeCast> = exact({
  arg: exact({ A_Const: aConstDecoder }),
  typeName: exact({ TypeName: typeNameDecoder }),
  location: locationDecoder,
});
