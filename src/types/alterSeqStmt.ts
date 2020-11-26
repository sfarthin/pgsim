import { CreateSeqStmt, createSeqStmtDecoder } from "./createSeqStmt";
export type AlterSeqStmt = CreateSeqStmt;

export const alterSeqStmtDecoder = createSeqStmtDecoder;
