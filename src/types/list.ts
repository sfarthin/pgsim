import * as d from "decoders";

export type List<T> = { items: T | T[] };
export const listDecoder = <T>(decoder: d.Decoder<T>): d.Decoder<List<T>> =>
  // @ts-expect-error -- close enough
  d.exact({ items: d.either(decoder, d.array(decoder)) });
