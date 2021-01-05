import * as d from "decoders";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 *
 * These are modified versions of https://github.com/nvie/decoders#dispatch
 */

export type Dispatch<
  O extends { [key: string]: d.Decoder<unknown> },
  K extends keyof O
> = d.Decoder<
  {
    [P in K]: Record<P, O[P]> &
      Partial<Record<Exclude<K, P>, never>> extends infer O
      ? { [Q in keyof O]: d.DecoderType<O[Q]> }
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
  O extends { [key: string]: d.Decoder<unknown> },
  K extends keyof O
>(o: O): Dispatch<O, K> {
  // Using "any" to limit verboseness
  // Since we use a correct type above, it
  // should infer just fine.
  return (blob: unknown): any => {
    return d.pojo(blob).andThen((v): any => {
      const key = Object.keys(v)[0];
      const val = Object.values(v)[0];
      const decoder = o[key];
      return d.exact({ [key]: decoder } as any)({ [key]: val });
    });
  };
}

export type $Values<T extends object> = T[keyof T];

export function dispatchByField<O extends { [key: string]: d.Decoder<any> }>(
  field: string,
  mapping: O
): d.Decoder<$Values<{ [key in keyof O]: d.DecoderType<O[key]> }>> {
  const base = d.object({
    [field]: d.compose(
      // We are using the "keys" of the mapping object to reconcile
      // the field type. Property names are strings by definition,
      // numbers are automatically converted to strings via toString().
      // For Example below, keys equals ['0'], not [0].
      //
      // const obj = { [0]: 'foo' };
      // const keys = Object.keys(obj);
      //
      // oneOf will fail unless we run toString to the field in
      // the decoded object also.
      //
      d.map(d.either(d.string, d.number), (value) => value.toString()),
      d.oneOf(Object.keys(mapping))
    ),
  });
  return (
    blob: unknown
  ): ReturnType<
    d.Decoder<$Values<{ [key in keyof O]: d.DecoderType<O[key]> }>>
  > => {
    return base(blob).andThen((baseObj) => {
      const decoderName = baseObj[field];
      const decoder = mapping[decoderName];
      return decoder(blob);
    });
  };
}
