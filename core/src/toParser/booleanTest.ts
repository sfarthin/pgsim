import { mixed, Decoder, exact, number } from "decoders";

export type BooleanTest = {
  arg: unknown;
  booltesttype: number;
  location: number;
};

export const booleanTestDecoder: Decoder<BooleanTest> = exact({
  arg: mixed,
  booltesttype: number,
  location: number,
});
