import {
  transform,
  identifier,
  ALTER,
  TYPE,
  OWNER,
  TO,
  Rule,
  sequence,
  endOfStatement,
  combineComments,
  __,
  EOS,
} from "./util";
import { AlterOwnerStmt } from "~/types";

export const alterOwnerStmt: Rule<{
  eos: EOS;
  value: { AlterOwnerStmt: AlterOwnerStmt };
}> = transform(
  sequence([
    ALTER,
    __,
    TYPE,
    __,
    identifier, // 5
    __,
    OWNER,
    __,
    TO,
    __, // 10
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    endOfStatement, // 13
  ]),
  (v) => ({
    eos: v[12],
    value: {
      AlterOwnerStmt: {
        objectType: "OBJECT_TYPE",
        object: { List: { items: [{ String: { str: v[4] } }] } },
        newowner: {
          roletype: "ROLESPEC_CSTRING",
          rolename: v[10].value,
          location: v[10].pos,
        },
        codeComment: combineComments(
          v[1],
          v[3],
          v[5],
          v[7],
          v[9],
          v[11],
          v[12].comment
        ),
      },
    },
  })
);
