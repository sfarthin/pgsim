import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";

export enum SubLinkType {
  EXISTS_SUBLINK = 0,
  ALL_SUBLINK = 1,
  ANY_SUBLINK = 2,
  ROWCOMPARE_SUBLINK = 3, // >
  EXPR_SUBLINK = 4,
  MULTIEXPR_SUBLINK = 5,
  ARRAY_SUBLINK = 6,
  CTE_SUBLINK = 7,
}

export type SubLink = {
  subLinkType: SubLinkType;
  subselect: {
    SelectStmt: SelectStmt;
  };
  location: Location;
};

export const subLinkDecoder = d.exact({
  subLinkType: d.oneOf(Object.values(SubLinkType)) as d.Decoder<SubLinkType>,
  subselect: d.exact({
    SelectStmt: (blob) => selectStmtDecoder(blob),
  }),
  location: locationDecoder,
});
