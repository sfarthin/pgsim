import * as d from "decoders";

export const paramRefDecoder = d.exact({
  number: d.number,
  location: d.number,
});

export type ParamRef = d.DecoderType<typeof paramRefDecoder>;
