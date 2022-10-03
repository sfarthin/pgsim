import * as d from "decoders";
import { TypeCatalog } from "~/constants";
import { stringDecoder, A_Const, aConstDecoder } from "./constant";
import { Location, locationDecoder } from "./location";

export type TypeNameArrayBounds = [
  {
    Integer: {
      ival: -1;
    };
  }
];

export type TypeName = {
  names:
    | [
        { String: { str: "pg_catalog" } },
        { String: { str: TypeCatalog[number]["name"] } }
      ]
    | [{ String: { str: TypeCatalog[number]["name"] } }];
  typemod: number;
  typmods?:
    | [{ A_Const: A_Const }]
    | [{ A_Const: A_Const }, { A_Const: A_Const }];
  location: Location;

  // Adding "[]" to indicate a list.
  arrayBounds?: TypeNameArrayBounds;
};

export const typeNameDecoder: d.Decoder<TypeName> = d.exact({
  names: d.either(
    d.tuple1(stringDecoder),
    d.tuple2(stringDecoder, stringDecoder)
  ) as d.Decoder<TypeName["names"]>,
  typemod: d.number,
  typmods: d.optional(
    d.either(
      d.tuple1(d.exact({ A_Const: aConstDecoder })),
      d.tuple2(
        d.exact({ A_Const: aConstDecoder }),
        d.exact({ A_Const: aConstDecoder })
      )
    )
  ),
  location: locationDecoder,
  arrayBounds: d.optional(
    d.tuple1(d.exact({ Integer: d.exact({ ival: d.constant(-1) }) }))
  ),
});
