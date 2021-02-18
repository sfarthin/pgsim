import {
  transform,
  ALTER,
  SEQUENCE,
  identifier,
  listWithCommentsPerItem,
  Rule,
  phrase,
  endOfStatement,
  optional,
  combineComments,
  sequence,
  commentsOnSameLine,
  finalizeComment,
} from "./util";
import { AlterSeqStmt, RangeVar } from "../types";
import { defElem } from "./defElem";

export const alterSeqStmt: Rule<AlterSeqStmt> = transform(
  sequence([
    phrase([
      ALTER,
      SEQUENCE,
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
    const inlineCommentAfterSemiColon = v[3];

    return {
      sequence: v[0].value[2],
      ...(v[2] && v[2].value && v[2].value.length
        ? {
            options: v[2].value.map((b, i) => ({
              DefElem: {
                ...b.value,
                codeComment: finalizeComment(
                  combineComments(
                    b.codeComment,
                    b.value.codeComment,

                    // If this is the last item add the inline comment after semicolon.
                    v[2] && i === v[2].value.length - 1
                      ? inlineCommentAfterSemiColon
                      : ""
                  )
                ),
              },
            })),
          }
        : {}),
      codeComment: finalizeComment(
        combineComments(v[0].codeComment, v[1], v[2]?.codeComment)
      ),
    };
  }
);
