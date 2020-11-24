import {
  exact,
  Decoder,
  string,
  either,
  either6,
  optional,
  number,
  constant,
  array,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type CreateSeqStmtOption = {
  DefElem:
    | {
        defname:
          | "start"
          | "increment"
          | "maxvalue"
          | "cache"
          | "minvalue"
          | "cycle";
        arg?: {
          Integer: { ival: number };
        };
        defaction: number;
        location: number;
      }
    | {
        defname: "owned_by";
        arg: {
          String: { str: string };
        }[];
        defaction: number;
        location: number;
      };
};

const createSeqStmtOptionsDecoder: Decoder<CreateSeqStmtOption> = exact({
  DefElem: either(
    exact({
      defname: either6(
        constant("start" as const),
        constant("increment" as const),
        constant("maxvalue" as const),
        constant("cache" as const),
        constant("minvalue" as const),
        constant("cycle" as const)
      ),
      arg: optional(exact({ Integer: exact({ ival: number }) })),
      defaction: number,
      location: number,
    }),
    exact({
      defname: constant("owned_by" as const),
      arg: array(exact({ String: exact({ str: string }) })),
      defaction: number,
      location: number,
    })
  ),
});

export type CreateSeqStmt = {
  sequence: { RangeVar: RangeVar };
  options?: CreateSeqStmtOption[];
};

export const createSeqStmtDecoder: Decoder<CreateSeqStmt> = exact({
  sequence: exact({ RangeVar: rangeVarDecoder }),
  options: optional(array(createSeqStmtOptionsDecoder)),
});
