import {
  transform,
  identifier,
  EQUALS,
  SET,
  Rule,
  phrase,
  endOfStatement,
  combineComments,
  finalizeComment,
} from "./util";
import { aConst } from "./aConst";
import { VariableSetStmt } from "~/types";

export const variableSetStmt: Rule<VariableSetStmt> = transform(
  phrase([SET, identifier, EQUALS, aConst, endOfStatement]),
  ({ comment, value }) => ({
    kind: 0,
    name: value[1],
    args: [{ A_Const: value[3] }],
    comment: finalizeComment(combineComments(comment, value[4])),
  })
);

variableSetStmt.identifier = "variableSetStmt";
