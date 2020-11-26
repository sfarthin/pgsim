import { optional, exact, string, Decoder, array } from "decoders";
import { PGString, stringDecoder } from "./constant";

export type Alias = {
  aliasname: string;

  // Example with colnames
  // SELECT
  //     x,
  //     x :: int2 AS int2_value
  //   FROM
  //     (
  //       VALUES
  //         (-2.5 :: float8),
  //         (-1.5 :: float8),
  //         (-0.5 :: float8),
  //         (0.0 :: float8),
  //         (0.5 :: float8),
  //         (1.5 :: float8),
  //         (2.5 :: float8)
  //     ) t(x)
  colnames?: PGString[];
};

export const aliasDecoder: Decoder<Alias> = exact({
  aliasname: string,
  colnames: optional(array(stringDecoder)),
});
