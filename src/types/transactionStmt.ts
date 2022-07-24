import * as d from "decoders";

export const transactionStmtDecoder: d.Decoder<TransactionStmt> = d.object({
  kind: d.oneOf([
    "TRANS_STMT_BEGIN",
    "TRANS_STMT_COMMIT",
    "TRANS_STMT_ROLLBACK",
  ] as const),
});

export type TransactionStmt = {
  kind: "TRANS_STMT_BEGIN" | "TRANS_STMT_COMMIT" | "TRANS_STMT_ROLLBACK";
  codeComment?: string;
};
