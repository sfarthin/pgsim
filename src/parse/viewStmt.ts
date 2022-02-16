import {
  transform,
  identifier,
  CREATE,
  VIEW,
  __,
  AS,
  Rule,
  sequence,
  endOfStatement,
  combineComments,
  maybeInParens,
  _,
  EOS,
} from "./util";
import { ViewStmt } from "../types";
import { select } from "./selectStmt";

export const viewStmt: Rule<{ eos: EOS; value: { ViewStmt: ViewStmt } }> =
  transform(
    sequence([
      _,
      CREATE,
      __,
      VIEW,
      __,
      transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
      __, // 6
      AS,
      __,
      maybeInParens(select),
      __,
      endOfStatement,
    ]),
    (v) => ({
      eos: v[11],
      value: {
        ViewStmt: {
          view: {
            relname: v[5].value,
            relpersistence: "p",
            location: v[5].pos,
            inh: true,
          },
          query: {
            SelectStmt: {
              ...v[9].value.value,
              codeComment: combineComments(
                v[8],
                v[9].topCodeComment,
                // v[9].value.codeComment,
                v[9].bottomCodeComment,
                v[10],
                v[11].comment
              ),
            },
          },
          withCheckOption: "NO_CHECK_OPTION",
          codeComment: combineComments(v[0], v[2], v[4], v[6]),
        },
      },
    })
  );
