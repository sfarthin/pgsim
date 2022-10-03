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
  MATERIALIZED,
} from "./util";
import { CreateTableAsStmt } from "~/types";
import { select } from "./selectStmt";

export const createTableAsStmt: Rule<{
  eos: EOS;
  value: { CreateTableAsStmt: CreateTableAsStmt };
}> = transform(
  sequence([
    CREATE,
    __,
    MATERIALIZED,
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
      CreateTableAsStmt: {
        into: {
          rel: {
            relname: v[6].value,
            relpersistence: "p",
            location: v[6].pos,
            inh: true,
          },
          onCommit: "ONCOMMIT_NOOP",
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
        relkind: "OBJECT_MATVIEW",
        codeComment: combineComments(v[1], v[3], v[5], v[7]),
      },
    },
  })
);
