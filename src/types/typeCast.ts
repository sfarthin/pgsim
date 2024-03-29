import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { typeNameDecoder, TypeName } from "./typeName";
import { RawValue, rawValueDecoder } from "./rawExpr";

export type TypeCast = {
  arg?: RawValue;
  typeName: TypeName;
  location: Location;
};

export const typeCastDecoder: d.Decoder<TypeCast> = d.exact({
  arg: (blob) => rawValueDecoder(blob),
  typeName: typeNameDecoder,
  location: locationDecoder,
});
