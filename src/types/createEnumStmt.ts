import * as d from "decoders";
import { stringValueDecoder, String } from "./constant";

export type CreateEnumStmt = {
  typeName: [{ String: String }] | [{ String: String }, { String: String }];
  vals: {
    String: { str: string };
    codeComment?: string;
  }[];
  codeComment?: string;
};

export const createEnumStmtDecoder: d.Decoder<CreateEnumStmt> = d.exact({
  typeName: d.either(
    d.tuple1(d.exact({ String: stringValueDecoder })),
    d.tuple2(
      d.exact({ String: stringValueDecoder }),
      d.exact({ String: stringValueDecoder })
    )
  ),
  vals: d.array(
    d.exact({ String: stringValueDecoder, codeComment: d.optional(d.string) })
  ),
  codeComment: d.optional(d.string),
});
