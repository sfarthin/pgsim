import * as d from "decoders";
import { Location, locationDecoder } from "./location";
import { SelectStmt, selectStmtDecoder } from "./selectStmt";
import { dispatchByField } from "./dispatch";
import { RawValue, rawValueDecoder } from "./rawExpr";

export enum SubLinkType {
  EXISTS_SUBLINK = 0,
  ALL_SUBLINK = 1,
  ANY_SUBLINK = 2,
  ROWCOMPARE_SUBLINK = 3,
  EXPR_SUBLINK = 4,
  MULTIEXPR_SUBLINK = 5,
  ARRAY_SUBLINK = 6,
  CTE_SUBLINK = 7,
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
  dispatchByField("subLinkType", {
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
