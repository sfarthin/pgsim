import * as d from "decoders";
import { A_Const, aConstDecoder } from "./constant";

export type VariableSetStmt = {
  kind: number;
  name: string;
  args?: [{ A_Const: A_Const }];
  is_local?: boolean;
  codeComment?: string;
};

export const variableSetStmtDecoder: d.Decoder<VariableSetStmt> = d.exact({
  kind: d.number,
  name: d.string,
  args: d.optional(d.tuple1(d.exact({ A_Const: aConstDecoder }))),
  is_local: d.optional(d.boolean),
  codeComment: d.optional(d.string),
});
