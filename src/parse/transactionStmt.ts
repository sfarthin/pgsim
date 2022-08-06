import { TransactionStmt } from "~/types";
import {
  transform,
  sequence,
  BEGIN,
  COMMIT,
  ROLLBACK,
  __,
  _,
  endOfStatement,
  or,
  Rule,
  EOS,
  combineComments,
} from "./util";

const beginStatement = transform(
  sequence([_, BEGIN, __, endOfStatement]),
  (v) => ({
    value: {
      TransactionStmt: {
        kind: "TRANS_STMT_BEGIN" as const,
        codeComment: combineComments(v[0], v[2], v[3].comment),
      },
    },
    eos: v[3],
  })
);
const commitStatement = transform(
  sequence([_, COMMIT, __, endOfStatement]),
  (v) => ({
    value: {
      TransactionStmt: {
        kind: "TRANS_STMT_COMMIT" as const,
        codeComment: combineComments(v[0], v[2], v[3].comment),
      },
    },
    eos: v[3],
  })
);

const rollbackStatement = transform(
  sequence([_, ROLLBACK, __, endOfStatement]),
  (v) => ({
    value: {
      TransactionStmt: {
        kind: "TRANS_STMT_ROLLBACK" as const,
        codeComment: combineComments(v[0], v[2], v[3].comment),
      },
    },
    eos: v[3],
  })
);

export const transactionStmt: Rule<{
  eos: EOS;
  value: { TransactionStmt: TransactionStmt };
}> = or([commitStatement, rollbackStatement, beginStatement]);
