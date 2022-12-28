import { DeleteStmt } from "~/types";
import { rangeVar } from "./rangeVar";
import {
  Rule,
  EOS,
  sequence,
  transform,
  DELETE,
  FROM,
  __,
  endOfStatement,
  combineComments,
  optional,
  USING,
} from "./util";
import { fromClause, where } from "./selectStmt";

export const deleteStmt: Rule<{
  value: { DeleteStmt: DeleteStmt };
  eos: EOS;
}> = transform(
  sequence([
    DELETE,
    __,
    FROM,
    __,
    rangeVar,
    __,
    optional(sequence([USING, __, fromClause])),
    __,
    optional(where),
    endOfStatement,
  ]),
  (v) => {
    return {
      value: {
        DeleteStmt: {
          relation: v[4].value.RangeVar,
          whereClause: v[8]?.whereClause,
          usingClause: v[6]?.[2].value,
          codeComment: combineComments(
            v[1],
            v[3],
            v[4].codeComment,
            v[5],
            ...(v[6] ? [v[6][1], ...v[6][2].codeComments] : []),
            v[7],
            ...(v[8] ? v[8]?.codeComments.whereClause : []),
            v[9].comment
          ),
        },
      },
      eos: v[9],
    };
  }
);
