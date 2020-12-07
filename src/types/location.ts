import { number, exact, either, Decoder } from "decoders";

// This type differs on which parser is used, PEGJS returns the larger type.
export type Location =
  | number
  | {
      start: { offset: number; line: number; column: number };
      end: { offset: number; line: number; column: number };
    };

export const locationDecoder: Decoder<Location> = either(
  number,
  exact({
    start: exact({ offset: number, line: number, column: number }),
    end: exact({ offset: number, line: number, column: number }),
  })
);
