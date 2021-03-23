import {
  transform,
  CREATE,
  SEQUENCE,
  identifier,
  listWithCommentsPerItem,
  Rule,
  phrase,
  endOfStatement,
  optional,
  ifNotExists,
  combineComments,
  sequence,
  commentsOnSameLine,
} from "./util";
import { CreateSeqStmt, RangeVar } from "../types";
import { defElem } from "./defElem";

export const createSeqStmt: Rule<CreateSeqStmt> = transform(
  sequence([
    phrase([
      CREATE,
      SEQUENCE,
      optional(ifNotExists),
      transform(identifier, (v, ctx) => ({
        RangeVar: {
          relname: v,
          relpersistence: "p",
          inh: true,
          location: ctx.pos,
        },
      })) as Rule<{ RangeVar: RangeVar }>,
    ]),
    commentsOnSameLine,
    optional(listWithCommentsPerItem(defElem)),
    endOfStatement,
  ]),
  (v) => {
    const hasList = v[2] && v[2].value && v[2].value.length;
    const inlineCommentAfterSemiColon = v[3];

    return {
      sequence: v[0].value[3],
      ...(v[2] && v[2].value && v[2].value.length
        ? {
            options: v[2].value.map((b, i) => ({
              DefElem: {
                ...b.value,
                codeComment: combineComments(
                  b.codeComment,
                  b.value.codeComment,

                  // If this is the last item add the inline comment after semicolon.
                  v[2] && i === v[2].value.length - 1
                    ? inlineCommentAfterSemiColon
                    : ""
                ),
              },
            })),
          }
        : {}),
      ...(v[0].value[2] !== null ? { if_not_exists: true } : {}),
      codeComment: combineComments(
        v[0].codeComment,
        v[1],
        v[2]?.codeComment,
        !hasList ? inlineCommentAfterSemiColon : "" // <-- include comment after semicolon only if there is no list.
      ),
    };
  }
);
