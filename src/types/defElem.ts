import {
  exact,
  either6,
  either,
  constant,
  number,
  optional,
  string,
  array,
  Decoder,
} from "decoders";
import { Location, locationDecoder } from "./location";

export type DefElem =
  | {
      defname:
        | "start"
        | "increment"
        | "maxvalue"
        | "cache"
        | "minvalue"
        | "cycle";
      arg?: {
        Integer: { ival: number };
      };
      defaction: number;
      location: Location;
      codeComment?: string;
    }
  | {
      defname: "owned_by";
      arg: {
        String: { str: string };
      }[];
      defaction: number;
      location: Location;
      codeComment?: string;
    };

export const defElemDecoder: Decoder<DefElem> = either(
  exact({
    defname: either6(
      constant("start" as const),
      constant("increment" as const),
      constant("maxvalue" as const),
      constant("cache" as const),
      constant("minvalue" as const),
      constant("cycle" as const)
    ),
    arg: optional(exact({ Integer: exact({ ival: number }) })),
    defaction: number,
    location: locationDecoder,
    codeComment: optional(string),
  }),
  exact({
    defname: constant("owned_by" as const),
    arg: array(exact({ String: exact({ str: string }) })),
    defaction: number,
    location: locationDecoder,
    codeComment: optional(string),
  })
);
