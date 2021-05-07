import * as d from "decoders";
import { tuple1 } from "./tuple1";
import { String, stringDecoder } from "../types/constant";

export type AlterOwnerStmt = {
  objectType: number;
  object: [{ String: String }];
  newowner: {
    RoleSpec: {
      roletype: number;
      rolename: string;
      location: number;
    };
  };
  codeComment?: string;
};

// export const alterOwnerStmtDecoder =
export const alterOwnerStmtDecoder: d.Decoder<AlterOwnerStmt> = d.exact({
  objectType: d.number,
  object: tuple1(stringDecoder),
  newowner: d.exact({
    RoleSpec: d.exact({
      roletype: d.number,
      rolename: d.string,
      location: d.number,
    }),
  }),
  codeComment: d.optional(d.string),
});
