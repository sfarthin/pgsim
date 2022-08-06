import { CommentStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const commentStmt: Rule<{
  value: { CommentStmt: CommentStmt },
  eos: EOS,
}> = fail;
