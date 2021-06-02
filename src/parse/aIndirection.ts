import { aConst } from "./aConst";
import { rawValue } from "./rawExpr";
import {
  sequence,
  __,
  combineComments,
  OPEN_BRACKET,
  CLOSE_BRACKET,
} from "./util";

export const aIndirection = sequence([
  (blob) => rawValue(blob),
  __,
  OPEN_BRACKET,
  __,
  aConst,
  __,
  CLOSE_BRACKET,
]);
