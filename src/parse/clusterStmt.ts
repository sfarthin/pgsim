import { ClusterStmt } from "~/types";
import { Rule, EOS, fail } from "./util";

export const clusterStmt: Rule<{
  value: { ClusterStmt: ClusterStmt },
  eos: EOS,
}> = fail;
