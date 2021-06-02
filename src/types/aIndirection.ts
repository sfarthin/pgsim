import { A_Const, aConstDecoder } from "./constant";
import { RawValue, rawValueDecoder } from "./rawExpr";
import * as d from "decoders";

export type AIndirection = {
  arg: RawValue;
  indirection: [
    {
      A_Indices: {
        uidx: {
          A_Const: A_Const;
        };
      };
    }
  ];
};

export const aIndirectionDecoder: d.Decoder<AIndirection> = d.exact({
  arg: (blob) => rawValueDecoder(blob),
  indirection: d.tuple1(
    d.exact({
      A_Indices: d.exact({ uidx: d.exact({ A_Const: aConstDecoder }) }),
    })
  ),
});
