import * as d from "decoders";

// This type differs on which parser is used, PEGJS returns the larger type.
export type Location = number;

export const locationDecoder: d.Decoder<Location> = d.number;
