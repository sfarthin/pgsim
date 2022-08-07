import * as d from "decoders";
import { A_Const, aConstDecoder } from "./constant";
import { TypeCast } from "./typeCast";

export type VariableSetStmt = {
  kind: "VAR_SET_VALUE";
  name: string;
  args?: [
    | { A_Const: A_Const }
    | {
        // SET TIME ZONE INTERVAL '+00:00' HOUR TO MINUTE;
        TypeCast: TypeCast;
      }
  ];
  is_local?: boolean;
  codeComment?: string;
};

export const variableSetStmtDecoder: d.Decoder<VariableSetStmt> = d.exact({
  kind: d.constant("VAR_SET_VALUE"),
  name: d.string,
  args: d.optional(d.tuple1(d.exact({ A_Const: aConstDecoder }))),
  is_local: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
