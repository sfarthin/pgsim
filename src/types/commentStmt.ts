import * as d from "decoders";

export const commentStmtDecoder = d.exact({
  objtype: d.constant("OBJECT_COLUMN"),
  object: d.exact({
    List: d.exact({
      items: d.array(
        d.exact({
          String: d.exact({
            str: d.string,
          }),
        })
      ),
    }),
  }),
  comment: d.string,
  codeComment: d.optional(d.string),
});
export type CommentStmt = d.DecoderType<typeof commentStmtDecoder>;
