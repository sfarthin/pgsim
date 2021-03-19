import { sequence, Rule, LPAREN, RPAREN, __ } from "./util";
import { select } from "./selectStmt";
import { SubLink } from "../types";

export const subLink: Rule<SubLink> = sequence([
  LPAREN,
  __,
  select,
  __,
  RPAREN,
]);
