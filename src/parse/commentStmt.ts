import { CommentStmt } from "~/types";
import {
  Rule,
  EOS,
  sequence,
  transform,
  COLUMN,
  or,
  keyword,
  ON,
  __,
  IS,
  quotedString,
  endOfStatement,
  combineComments,
  tableIdentifier,
} from "./util";

const objectType: Rule<{
  value: Pick<CommentStmt, "objtype" | "object">;
  codeComment: string;
}> = or([
  transform(sequence([COLUMN, __, tableIdentifier]), (v) => ({
    value: {
      objtype: "OBJECT_COLUMN" as const,
      object: { List: { items: v[2].map((str) => ({ String: { str } })) } },
    },
    codeComment: "",
  })),
]);

export const commentStmt: Rule<{
  value: { CommentStmt: CommentStmt };
  eos: EOS;
}> = transform(
  sequence([
    keyword("COMMENT" as any),
    __,
    ON,
    __,
    objectType,
    __,
    IS,
    __,
    quotedString,
    endOfStatement,
  ]),
  (v) => {
    return {
      eos: v[9],
      value: {
        CommentStmt: {
          comment: v[8].value,
          objtype: v[4].value.objtype,
          object: v[4].value.object,
          codeComment: combineComments(
            v[1],
            v[3],
            v[4].codeComment,
            v[5],
            v[7],
            v[9].comment
          ),
        },
      },
    };
  }
);
