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
  _,
} from "./util";
import { AlterOwnerStmt } from "../types";

export const alterOwnerStmt: Rule<AlterOwnerStmt> = transform(
  sequence([
    _, // 0
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
    objectType: "OBJECT_TYPE",
    object: { List: { items: [{ String: { str: v[5] } }] } },
    newowner: {
      roletype: "ROLESPEC_CSTRING",
      rolename: v[11].value,
      location: v[11].pos,
    },
    codeComment: combineComments(
      v[0],
      v[2],
      v[4],
      v[6],
      v[8],
      v[10],
      v[12],
      v[13]
    ),
  })
);
