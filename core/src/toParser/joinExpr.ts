import { number, exact, Decoder, unknown } from "decoders";

// export enum JoinType {
//   "Full" = 0,
//   "Left" = 1,
// }

// const fullTypeDecoder: Decoder<JoinType.Full> = constant(JoinType.Full);
// const leftTypeDecoder: Decoder<JoinType.Left> = constant(JoinType.Left);

export type JoinExpr = {
  jointype: number;
  larg?: unknown; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
  rarg?: unknown; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
  quals?: unknown;
  isNatural?: unknown;
  usingClause?: unknown;
  alias?: unknown;
};

export const joinExprDecoder: Decoder<JoinExpr> = exact({
  jointype: number,
  larg: unknown,
  rarg: unknown,
  quals: unknown,
  isNatural: unknown,
  usingClause: unknown,
  alias: unknown,
});
