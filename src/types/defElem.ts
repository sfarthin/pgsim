import * as d from "decoders";
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

export const defElemDecoder: d.Decoder<DefElem> = d.either(
  d.exact({
    defname: d.either6(
      d.constant("start"),
      d.constant("increment"),
      d.constant("maxvalue"),
      d.constant("cache"),
      d.constant("minvalue"),
      d.constant("cycle")
    ),
    arg: d.optional(d.exact({ Integer: d.exact({ ival: d.number }) })),
    defaction: d.number,
    location: locationDecoder,
    codeComment: d.optional(d.string),
  }),
  d.exact({
    defname: d.constant("owned_by"),
    arg: d.array(d.exact({ String: d.exact({ str: d.string }) })),
    defaction: d.number,
    location: locationDecoder,
    codeComment: d.optional(d.string),
  })
);
