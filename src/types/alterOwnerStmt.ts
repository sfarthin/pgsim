import * as d from "decoders";
import { tuple1 } from "./tuple1";
import { PGString, stringDecoder } from "~/types/constant";

export type AlterOwnerStmt = {
  objectType: number;
  object: [PGString];
  newowner: {
    RoleSpec: {
      roletype: number;
      rolename: string;
      location: number;
    };
  };
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
});
