import { TransactionStmt } from "../types/transactionStmt";
import { symbol, comment, keyword } from "./util";

function toKeyword(c: TransactionStmt): "BEGIN" | "COMMIT" | "ROLLBACK" {
  switch (c.kind) {
    case "TRANS_STMT_BEGIN":
      return "BEGIN";
    case "TRANS_STMT_COMMIT":
      return "COMMIT";
    case "TRANS_STMT_ROLLBACK":
      return "ROLLBACK";
  }
}

export default function transactionStmt(c: TransactionStmt) {
  return [...comment(c.codeComment), [keyword(toKeyword(c)), symbol(";")]];
}
