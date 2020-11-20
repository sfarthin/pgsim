import { Decoder, exact, number, unknown } from "decoders";

export type BooleanTest = {
  arg?: unknown;
  booltesttype: number;
  location: number;
};

export const booleanTestDecoder: Decoder<BooleanTest> = exact({
  arg: unknown,
  booltesttype: number,
  location: number,
});
