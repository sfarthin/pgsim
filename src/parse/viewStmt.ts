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
  EOS,
} from "./util";
import { ViewStmt } from "~/types";
import { select } from "./selectStmt";

export const viewStmt: Rule<{ eos: EOS; value: { ViewStmt: ViewStmt } }> =
  transform(
    sequence([
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
      eos: v[10],
      value: {
        ViewStmt: {
          view: {
            relname: v[4].value,
            relpersistence: "p",
            location: v[4].pos,
            inh: true,
          },
          query: {
            SelectStmt: {
              ...v[8].value.value,
              codeComment: combineComments(
                v[7],
                v[8].topCodeComment,
                v[8].bottomCodeComment,
                v[9],
                v[10].comment
              ),
            },
          },
          withCheckOption: "NO_CHECK_OPTION",
          codeComment: combineComments(v[1], v[3], v[5]),
        },
      },
    })
  );
