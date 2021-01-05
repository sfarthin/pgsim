import { number, Decoder } from "decoders";

// This type differs on which parser is used, PEGJS returns the larger type.
export type Location = number;

export const locationDecoder: Decoder<Location> = number;
