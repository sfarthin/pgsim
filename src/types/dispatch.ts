import { Decoder, pojo, DecoderType, exact } from "decoders";

export type Dispatch<
  O extends { [key: string]: Decoder<unknown> },
  K extends keyof O
> = Decoder<
  {
    [P in K]: Record<P, O[P]> &
      Partial<Record<Exclude<K, P>, never>> extends infer O
      ? { [Q in keyof O]: DecoderType<O[Q]> }
      : never;
  }[K]
>;

// export const wrongDecoder1: Decoder<
//   { foobar: string } | { bar: number }
// > = dispatch({
//   foo: string,
//   bar: number,
// });

// export const wrongDecoder2: Decoder<
//   { foo: string } | { bar: number }
// > = dispatch({
//   foo: string,
//   bar: number,
//   foobar: number,
// });

// export const decoder: Decoder<
//   { foo: string } | { bar: number } | { f: number }
// > = dispatch({
//   foo: string,
//   bar: number,
// });

// const result = guard(decoder)({ bar: "5" });

// // Typescript correct infers the type
// if ("bar" in result) {
//   console.log(result.bar);
// }

// if ("foo" in result) {
//   console.log(result.foo);
// }

export default function dispatch<
  O extends { [key: string]: Decoder<unknown> },
  K extends keyof O
>(o: O): Dispatch<O, K> {
  // Using "any" to limit verboseness
  // Since we use a correct type above, it
  // should infer just fine.
  return (blob: unknown): any => {
    return pojo(blob).andThen((v): any => {
      const key = Object.keys(v)[0];
      const val = Object.values(v)[0];
      const decoder = o[key];
      return exact({ [key]: decoder } as any)({ [key]: val });
    });
  };
}
