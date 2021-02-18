import { Decoder, boolean, exact, string, number, optional } from "decoders";
import { A_Const, aConstDecoder } from "./constant";
import { tuple1 } from "./tuple1";

export type VariableSetStmt = {
  kind: number;
  name: string;
  args?: [{ A_Const: A_Const }];
  is_local?: boolean;
  codeComment?: string;
};

export const variableSetStmtDecoder: Decoder<VariableSetStmt> = exact({
  kind: number,
  name: string,
  args: optional(tuple1(exact({ A_Const: aConstDecoder }))),
  is_local: optional(boolean),
  codeComment: optional(string),
});
