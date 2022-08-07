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
  EOS,
  TO,
  or,
} from "./util";
import { aConst } from "./aConst";
import { VariableSetStmt } from "~/types";

export const variableSetStmt: Rule<{
  value: { VariableSetStmt: VariableSetStmt };
  eos: EOS;
}> = transform(
  sequence([
    _,
    SET,
    __,
    identifier,
    __,
    or([EQUALS, TO]),
    __,
    aConst,
    __,
    endOfStatement,
  ]),
  (v) => ({
    eos: v[9],
    value: {
      VariableSetStmt: {
        kind: "VAR_SET_VALUE",
        name: v[3],
        args: [v[7].value],
        codeComment: combineComments(
          v[0],
          v[2],
          v[4],
          v[6],
          v[7].codeComment,
          v[8],
          v[9].comment
        ),
      },
    },
  })
);
