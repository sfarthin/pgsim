import * as d from "decoders";
import { String, stringDecoder } from "../types/constant";

export type AlterOwnerStmt = {
  objectType: "OBJECT_TYPE";
  object: { List: { items: [{ String: String }] } };
  newowner: {
    roletype: "ROLESPEC_CSTRING";
    rolename: string;
    location: number;
  };
  codeComment?: string;
};

// export const alterOwnerStmtDecoder =
export const alterOwnerStmtDecoder: d.Decoder<AlterOwnerStmt> = d.exact({
  objectType: d.constant("OBJECT_TYPE"),
  object: d.exact({ List: d.exact({ items: d.tuple1(stringDecoder) }) }),
  newowner: d.exact({
    roletype: d.constant("ROLESPEC_CSTRING"),
    rolename: d.string,
    location: d.number,
  }),
  codeComment: d.optional(d.string),
});
