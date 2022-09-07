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
      eos: v[14],
      value: {
        AlterDatabaseSetStmt: {
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[9],
            v[11],
            "codeComment" in v[12] ? v[12].codeComment : "",
            v[13],
            v[14].comment
          ),
          dbname: v[4],
          setstmt:
            typeof v[12].value === "string"
              ? v[12].value === "DEFAULT"
                ? {
                    kind: "VAR_SET_DEFAULT",
                    name: v[8],
                  }
                : {
                    kind: "VAR_SET_CURRENT",
                    name: v[8],
                  }
              : {
                  kind: "VAR_SET_VALUE",
                  name: v[8],
                  args: [v[12].value],
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
      eos: v[10],
      value: {
        AlterDatabaseSetStmt: {
          codeComment: combineComments(
            v[1],
            v[3],
            v[5],
            v[7],
            v[9],
            v[10].comment
          ),
          dbname: v[4],
          setstmt:
            typeof v[8] === "string"
              ? {
                  kind: "VAR_RESET",
                  name: v[8],
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
