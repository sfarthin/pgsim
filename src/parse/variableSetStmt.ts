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
  TIME,
  ZONE,
  INTERVAL,
  HOUR,
  MINUTE,
} from "./util";
import { aConst, aConstString } from "./aConst";
import { A_Const, TypeCast, VariableSetStmt } from "~/types";

const typMod: Rule<{
  value: { A_Const: A_Const };
  codeComment: string;
}> = transform(sequence([HOUR, __, TO, __, MINUTE]), (v, ctx) => {
  return {
    value: {
      A_Const: {
        val: {
          Integer: {
            ival: 3072,
          },
        },
        location: ctx.pos,
      },
    },
    codeComment: combineComments(v[1], v[3]),
  } as const;
});

// SET TIME ZONE INTERVAL '+00:00' HOUR TO MINUTE;
const interval: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = transform(sequence([INTERVAL, __, aConstString, __, typMod]), (v, ctx) => {
  return {
    value: {
      TypeCast: {
        arg: v[2].value,
        typeName: {
          names: [
            {
              String: {
                str: "pg_catalog",
              },
            },
            {
              String: {
                str: "interval",
              },
            },
          ],
          typmods: [v[4].value],
          typemod: -1,
          location: ctx.pos,
        },
        location: -1,
      },
    },
    codeComment: combineComments(v[1], v[3]),
  };
});

const timezoneSetStmt: Rule<{
  value: { VariableSetStmt: VariableSetStmt };
  eos: EOS;
}> = transform(
  sequence([
    _,
    SET,
    __,
    TIME,
    __,
    ZONE,
    __,
    or([interval]), // 7
    endOfStatement,
  ]),
  (v) => ({
    eos: v[8],
    value: {
      VariableSetStmt: {
        kind: "VAR_SET_VALUE",
        name: "timezone",
        args: [v[7].value],
        codeComment: combineComments(
          v[0],
          v[2],
          v[4],
          v[6],
          v[7].codeComment,
          v[8].comment
        ),
      },
    },
  })
);

const basicVariableSetStmt: Rule<{
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

export const variableSetStmt: Rule<{
  value: { VariableSetStmt: VariableSetStmt };
  eos: EOS;
}> = or([timezoneSetStmt, basicVariableSetStmt]);
