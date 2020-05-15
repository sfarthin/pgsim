import { either, exact, Decoder, mixed, constant } from "decoders";

export enum JoinType {
  "Full" = 0,
  "Left" = 1,
}

const fullTypeDecoder: Decoder<JoinType.Full> = constant(JoinType.Full);
const leftTypeDecoder: Decoder<JoinType.Left> = constant(JoinType.Left);

export type JoinExpr =
  | {
      jointype: JoinType.Full;
      larg: unknown; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
      rarg: unknown; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
      quals: unknown;
    }
  | {
      jointype: JoinType.Left;
      larg: unknown; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
      rarg: unknown; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
      quals: unknown;
    };

export const joinExprDecoder: Decoder<JoinExpr> = either(
  exact({
    jointype: fullTypeDecoder,
    larg: mixed,
    rarg: mixed,
    quals: mixed,
  }),
  exact({
    jointype: leftTypeDecoder,
    larg: mixed,
    rarg: mixed,
    quals: mixed,
  })
);
