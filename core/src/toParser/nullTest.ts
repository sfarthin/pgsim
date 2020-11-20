import { Decoder, exact, number, unknown } from "decoders";

export type NullTest = {
  arg?: unknown;
  nulltesttype: number;
  location: number;
};

export const nullTestDecoder: Decoder<NullTest> = exact({
  arg: unknown,
  nulltesttype: number,
  location: number,
});
