import { Decoder, compose, poja, predicate } from "decoders";
import { Err, Ok } from "lemons/Result";
import { annotate } from "debrief";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const ntuple = (n: number) =>
  compose(
    poja,
    predicate((arr) => arr.length === n, `Must be a ${n}-tuple`)
  );

// Should be in future build: https://github.com/nvie/decoders/pull/488
export function tuple1<T>(decoder1: Decoder<T>): Decoder<[T]> {
  return compose(ntuple(1), (blobs: Array<unknown>) => {
    const [blob1] = blobs;

    const result1 = decoder1(blob1);
    try {
      return Ok([result1.unwrap()]);
    } catch (e) {
      // If a decoder error has happened while unwrapping all the
      // results, try to construct a good error message
      return Err(
        annotate([result1.isErr() ? result1.errValue() : result1.value()], "")
      );
    }
  });
}
