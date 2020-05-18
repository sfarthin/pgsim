import {
  string,
  number,
  exact,
  Decoder,
  optional,
  array,
  mixed,
} from "decoders";
import { RangeVar, rangeVarDecoder } from "./rangeVar";

export type ResTarget = {
  name: string | void;
  location: number;
};

export const resTargetDecoder: Decoder<ResTarget> = exact({
  name: optional(string),
  location: number,
});

export type InsertStmt = {
  relation: {
    RangeVar: RangeVar;
  };
  cols:
    | {
        ResTarget: ResTarget;
      }[]
    | void;

  selectStmt?: {
    SelectStmt: unknown;
  };

  returningList?: unknown;
};

export const insertStmtDecoder = exact({
  relation: exact({ RangeVar: rangeVarDecoder }),
  cols: optional(array(exact({ ResTarget: resTargetDecoder }))),
  selectStmt: optional(exact({ SelectStmt: mixed })),
  returningList: optional(mixed),
});
