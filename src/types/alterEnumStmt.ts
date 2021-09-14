import * as d from "decoders";

export type AlterEnumStmt =
  | {
      typeName: [
        {
          String: {
            str: string;
          };
        }
      ];
      newVal: string;
      newValIsAfter?: boolean;
      newValNeighbor?: string;
      skipIfNewValExists?: boolean;
      codeComment?: string;
    }
  | {
      typeName: [
        {
          String: {
            str: string;
          };
        }
      ];
      oldVal: string;
      newVal: string;
      codeComment?: string;
    };

export const alterEnumStmtDecoder: d.Decoder<AlterEnumStmt> = d.either(
  d.exact({
    typeName: d.tuple1(d.exact({ String: d.exact({ str: d.string }) })),
    newVal: d.string,
    newValIsAfter: d.optional(d.boolean),
    newValNeighbor: d.optional(d.string),
    skipIfNewValExists: d.optional(d.boolean),
  }),
  d.exact({
    typeName: d.tuple1(d.exact({ String: d.exact({ str: d.string }) })),
    newVal: d.string,
    oldVal: d.string,
  })
);
