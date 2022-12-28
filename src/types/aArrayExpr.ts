import * as d from "decoders";
import { rawValueDecoder } from "./rawExpr";

export const aArrayExprDecoder = d.exact({
  elements: d.optional(d.array(d.lazy(() => rawValueDecoder))),
  location: d.number,
});

export type AArrayExpr = d.DecoderType<typeof aArrayExprDecoder>;
