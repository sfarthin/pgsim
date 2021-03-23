import {
  transform,
  identifier,
  EQUALS,
  SET,
  Rule,
  sequence,
  endOfStatement,
  combineComments,
  _,
  __,
} from "./util";
import { aConst } from "./aConst";
import { VariableSetStmt } from "../types";

export const variableSetStmt: Rule<VariableSetStmt> = transform(
  sequence([
    _,
    SET,
    __,
    identifier,
    __,
    EQUALS,
    __,
    aConst,
    __,
    endOfStatement,
  ]),
  (v) => ({
    kind: 0,
    name: v[3],
    args: [{ A_Const: v[7] }],
    codeComment: combineComments(v[0], v[2], v[4], v[6], v[8], v[9]),
  })
);
