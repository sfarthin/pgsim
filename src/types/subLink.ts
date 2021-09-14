import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { RawValue, rawValueDecoder } from "./rawExpr";

export enum SubLinkType {
  EXISTS_SUBLINK = "EXISTS_SUBLINK",
  ALL_SUBLINK = "ALL_SUBLINK",
  ANY_SUBLINK = "ANY_SUBLINK",
  ROWCOMPARE_SUBLINK = "ROWCOMPARE_SUBLINK",
  EXPR_SUBLINK = "EXPR_SUBLINK",
  MULTIEXPR_SUBLINK = "MULTIEXPR_SUBLINK",
  ARRAY_SUBLINK = "ARRAY_SUBLINK",
  CTE_SUBLINK = "CTE_SUBLINK",
}

export type SubLink =
  | {
      subLinkType: SubLinkType.EXISTS_SUBLINK;
      subselect: {
        SelectStmt: SelectStmt;
      };
      location: Location;
    }
  | {
      subLinkType: SubLinkType.ANY_SUBLINK;
      testexpr: RawValue;
      subselect: {
        SelectStmt: SelectStmt;
      };
      location: Location;
    }
  | {
      subLinkType: SubLinkType.EXPR_SUBLINK;
      subselect: {
        SelectStmt: SelectStmt;
      };
      location: Location;
    };

export const subLinkDecoder: d.Decoder<SubLink> = (blob) =>
  d.dispatch("subLinkType", {
    [SubLinkType.EXISTS_SUBLINK]: d.exact({
      subLinkType: d.constant(
        SubLinkType.EXISTS_SUBLINK
      ) as d.Decoder<SubLinkType.EXISTS_SUBLINK>,
      subselect: d.exact({
        SelectStmt: (blob) => selectStmtDecoder(blob),
      }),
      location: locationDecoder,
    }),
    [SubLinkType.ANY_SUBLINK]: d.exact({
      subLinkType: d.constant(
        SubLinkType.ANY_SUBLINK
      ) as d.Decoder<SubLinkType.ANY_SUBLINK>,
      testexpr: rawValueDecoder,
      subselect: d.exact({
        SelectStmt: (blob) => selectStmtDecoder(blob),
      }),
      location: locationDecoder,
    }),
    [SubLinkType.EXPR_SUBLINK]: d.exact({
      subLinkType: d.constant(
        SubLinkType.EXPR_SUBLINK
      ) as d.Decoder<SubLinkType.EXPR_SUBLINK>,
      subselect: d.exact({
        SelectStmt: (blob) => selectStmtDecoder(blob),
      }),
      location: locationDecoder,
    }),
  })(blob);
