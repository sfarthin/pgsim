import { transform, identifier, EQUALS, SET, Rule, statement } from "./util";
import { aConst } from "./aConst";
import { VariableSetStmt } from "~/types";

export const variableSetStmt: Rule<VariableSetStmt> = transform(
  statement([SET, identifier, EQUALS, aConst]),
  ({ comment, value }) => ({
    kind: 0,
    name: value[1],
    args: [{ A_Const: value[3] }],
    comment,
  })
);
