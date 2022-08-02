import {
  transform,
  ALTER,
  DATABASE,
  identifier,
  Rule,
  endOfStatement,
  combineComments,
  sequence,
  __,
  _,
  EOS,
  SET,
  EQUALS,
  TO,
  or,
  identifierIncludingKeyword,
  FROM,
  RESET,
  ALL,
  DEFAULT,
  CURRENT,
} from "./util";
import { AlterDatabaseSetStmt } from "~/types";
import { aConst } from "./aConst";

const setVariety: Rule<{
  eos: EOS;
  value: { AlterDatabaseSetStmt: AlterDatabaseSetStmt };
}> = transform(
  sequence([
    _,
    ALTER,
    __,
    DATABASE,
    __,
    identifier, // 5
    __,
    SET,
    __,
    identifier,
    __,
    or([EQUALS, TO, FROM]),
    __,
    or([
      CURRENT,
      DEFAULT,
      aConst,
      transform(identifierIncludingKeyword, (str, c) => {
        return {
          codeComment: "",
          value: {
            A_Const: {
              location: c.pos,
              val: {
                String: {
                  str,
                },
              },
            },
          },
        };
      }),
    ]),
    __,
    endOfStatement, // 15
  ]),
  (v) => {
    return {
      eos: v[15],
      value: {
        AlterDatabaseSetStmt: {
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[10],
            v[12],
            "codeComment" in v[13] ? v[13].codeComment : "",
            v[14],
            v[15].comment
          ),
          dbname: v[5],
          setstmt:
            typeof v[13].value === "string"
              ? v[13].value === "DEFAULT"
                ? {
                    kind: "VAR_SET_DEFAULT",
                    name: v[9],
                  }
                : {
                    kind: "VAR_SET_CURRENT",
                    name: v[9],
                  }
              : {
                  kind: "VAR_SET_VALUE",
                  name: v[9],
                  args: [v[13].value],
                },
        },
      },
    };
  }
);

const resetVariety: Rule<{
  eos: EOS;
  value: { AlterDatabaseSetStmt: AlterDatabaseSetStmt };
}> = transform(
  sequence([
    _,
    ALTER,
    __,
    DATABASE,
    __,
    identifier,
    __,
    RESET,
    __,
    or([ALL, identifier]),
    __,
    endOfStatement,
  ]),
  (v) => {
    return {
      eos: v[11],
      value: {
        AlterDatabaseSetStmt: {
          codeComment: combineComments(
            v[0],
            v[2],
            v[4],
            v[6],
            v[8],
            v[10],
            v[11].comment
          ),
          dbname: v[5],
          setstmt:
            typeof v[9] === "string"
              ? {
                  kind: "VAR_RESET",
                  name: v[9],
                }
              : {
                  kind: "VAR_RESET_ALL",
                },
        },
      },
    };
  }
);

export const alterDatabaseSetStmt = or([setVariety, resetVariety]);
