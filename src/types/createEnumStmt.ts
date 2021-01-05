import { array, exact, either, Decoder, string, optional } from "decoders";
import { stringValueDecoder, StringValue } from "./constant";
import { tuple1, tuple2 } from "./tuple1";

export type CreateEnumStmt = {
  typeName:
    | [{ String: StringValue }]
    | [{ String: StringValue }, { String: StringValue }];
  vals: {
    String: { str: string };
    comment?: string;
  }[];
  comment?: string;
};

export const createEnumStmtDecoder: Decoder<CreateEnumStmt> = exact({
  typeName: either(
    tuple1(exact({ String: stringValueDecoder })),
    tuple2(exact({ String: stringValueDecoder }))
  ),
  vals: array(exact({ String: stringValueDecoder, comment: optional(string) })),
  comment: optional(string),
});
