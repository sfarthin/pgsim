import { array, exact, either, Decoder, string, optional } from "decoders";
import { stringValueDecoder, String } from "./constant";
import { tuple1, tuple2 } from "./tuple1";

export type CreateEnumStmt = {
  typeName: [{ String: String }] | [{ String: String }, { String: String }];
  vals: {
    String: { str: string };
    codeComment?: string;
  }[];
  codeComment?: string;
};

export const createEnumStmtDecoder: Decoder<CreateEnumStmt> = exact({
  typeName: either(
    tuple1(exact({ String: stringValueDecoder })),
    tuple2(exact({ String: stringValueDecoder }))
  ),
  vals: array(
    exact({ String: stringValueDecoder, codeComment: optional(string) })
  ),
  codeComment: optional(string),
});
