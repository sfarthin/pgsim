import { exact, Decoder } from "decoders";
import { Location, locationDecoder } from "./location";
import { typeNameDecoder, TypeName } from "./typeName";
import { RawExpr, getRawExprDecoder } from "./rawExpr";

export type TypeCast = {
  arg?: RawExpr;
  typeName: {
    TypeName: TypeName;
  };
  location: Location;
};

export const typeCastDecoder: Decoder<TypeCast> = exact({
  arg: getRawExprDecoder(),
  typeName: exact({ TypeName: typeNameDecoder }),
  location: locationDecoder,
});
