import * as d from "decoders";
import { String, stringDecoder } from "./constant";

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
  colnames?: { String: String }[];
};

export const aliasDecoder: d.Decoder<Alias> = d.exact({
  aliasname: d.string,
  colnames: d.optional(d.array(stringDecoder)),
});
