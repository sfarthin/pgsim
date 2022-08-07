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
import { VariableSetStmt } from "~/types";

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
    INTERVAL,
    __,
    aConstString,
    __, // 10
    HOUR,
    __,
    TO,
    __,
    MINUTE,
    __,
    endOfStatement,
  ]),
  (v) => ({
    eos: v[17],
    value: {
      VariableSetStmt: {
        kind: "VAR_SET_VALUE",
        name: "timezone",
        args: [
          {
            TypeCast: {
              arg: v[9].value,
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
                typmods: [
                  {
                    A_Const: {
                      val: {
                        Integer: {
                          ival: 3072,
                        },
                      },
                      location: 352,
                    },
                  },
                ],
                typemod: -1,
                location: 334,
              },
              location: -1,
            },
          },
        ],
        codeComment: combineComments(
          v[0],
          v[2],
          v[4],
          v[6],
          v[8],
          v[9].codeComment,
          v[10],
          v[12],
          v[14],
          v[16],
          v[17].comment
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
