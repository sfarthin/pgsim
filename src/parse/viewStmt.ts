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
  optional,
  OR,
  REPLACE,
} from "./util";
import { ViewStmt } from "~/types";
import { select } from "./selectStmt";

export const viewStmt: Rule<{ eos: EOS; value: { ViewStmt: ViewStmt } }> =
  transform(
    sequence([
      CREATE,
      __,
      optional(sequence([OR, __, REPLACE])),
      __,
      VIEW,
      __,
      transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
      __, // 7
      AS,
      __,
      maybeInParens(select),
      __,
      endOfStatement,
    ]),
    (v) => ({
      eos: v[12],
      value: {
        ViewStmt: {
          view: {
            relname: v[6].value,
            relpersistence: "p",
            location: v[6].pos,
            inh: true,
          },
          query: {
            SelectStmt: {
              ...v[10].value.value,
              codeComment: combineComments(
                v[9],
                v[10].topCodeComment,
                v[10].bottomCodeComment,
                v[11],
                v[12].comment
              ),
            },
          },
          withCheckOption: "NO_CHECK_OPTION",
          ...(v[2] ? { replace: true } : {}),
          codeComment: combineComments(v[1], v[3], v[5], v[7]),
        },
      },
    })
  );
