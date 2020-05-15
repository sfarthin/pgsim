import { Decoder, exact, mixed, number } from "decoders";

export type NullTest = { arg: unknown; nulltesttype: number; location: number };

export const nullTestDecoder: Decoder<NullTest> = exact({
  arg: mixed,
  nulltesttype: number,
  location: number,
});
