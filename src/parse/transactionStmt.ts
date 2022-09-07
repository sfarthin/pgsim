import { TransactionStmt } from "~/types";
import {
  transform,
  sequence,
  BEGIN,
  COMMIT,
  ROLLBACK,
  __,
  endOfStatement,
  or,
  Rule,
  EOS,
  combineComments,
} from "./util";

const beginStatement = transform(
  sequence([BEGIN, __, endOfStatement]),
  (v) => ({
    value: {
      TransactionStmt: {
        kind: "TRANS_STMT_BEGIN" as const,
        codeComment: combineComments(v[1], v[2].comment),
      },
    },
    eos: v[2],
  })
);
const commitStatement = transform(
  sequence([COMMIT, __, endOfStatement]),
  (v) => ({
    value: {
      TransactionStmt: {
        kind: "TRANS_STMT_COMMIT" as const,
        codeComment: combineComments(v[1], v[2].comment),
      },
    },
    eos: v[2],
  })
);

const rollbackStatement = transform(
  sequence([ROLLBACK, __, endOfStatement]),
  (v) => ({
    value: {
      TransactionStmt: {
        kind: "TRANS_STMT_ROLLBACK" as const,
        codeComment: combineComments(v[1], v[2].comment),
      },
    },
    eos: v[2],
  })
);

export const transactionStmt: Rule<{
  eos: EOS;
  value: { TransactionStmt: TransactionStmt };
}> = or([commitStatement, rollbackStatement, beginStatement]);
