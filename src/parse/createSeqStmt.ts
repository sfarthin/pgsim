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
  IF,
  NOT,
  EXISTS,
  tableIdentifier,
  OWNED,
  BY,
  NONE,
  or,
  NO,
  CYCLE,
  MAXVALUE,
  MINVALUE,
  CACHE,
  integer,
  WITH,
  START,
  INCREMENT,
  combineComments,
  sequence,
  commentsOnSameLine,
} from "./util";
import { CreateSeqStmt, DefElem, RangeVar } from "~/types";

const defElem: Rule<DefElem> = or([
  transform(phrase([OWNED, BY, NONE]), (v, ctx) => ({
    defname: "owned_by",
    arg: [{ String: { str: "none" } }],
    defaction: 0,
    location: ctx.pos,
    comment: v.comment,
  })),
  transform(
    phrase([OWNED, BY, tableIdentifier]),
    ({ comment, value }, ctx) => ({
      defname: "owned_by",
      defaction: 0,
      arg: value[2].map((str) => ({ String: { str } })),
      location: ctx.pos,
      comment,
    })
  ),
  transform(phrase([NO, CYCLE]), (v, ctx) => ({
    defname: "cycle",
    defaction: 0,
    arg: { Integer: { ival: 0 } },
    location: ctx.pos,
    comment: v.comment,
  })),
  transform(phrase([NO, MAXVALUE]), ({ comment }, ctx) => ({
    defname: "maxvalue",
    defaction: 0,
    location: ctx.pos,
    comment,
  })),
  transform(phrase([NO, MINVALUE]), ({ comment }, ctx) => ({
    defname: "minvalue",
    defaction: 0,
    location: ctx.pos,
    comment,
  })),
  transform(phrase([NO, CACHE]), ({ comment }, ctx) => ({
    defname: "cache",
    defaction: 0,
    location: ctx.pos,
    comment,
  })),
  transform(phrase([CYCLE]), ({ comment }, ctx) => ({
    defname: "cycle",
    defaction: 0,
    arg: { Integer: { ival: 1 } },
    location: ctx.pos,
    comment,
  })),
  transform(phrase([MAXVALUE, integer]), ({ value, comment }, ctx) => ({
    defname: "maxvalue",
    defaction: 0,
    arg: { Integer: { ival: value[1] } },
    location: ctx.pos,
    comment,
  })),
  transform(phrase([MINVALUE, integer]), ({ comment, value }, ctx) => ({
    defname: "minvalue",
    defaction: 0,
    arg: { Integer: { ival: value[1] } },
    location: ctx.pos,
    comment,
  })),
  transform(phrase([CACHE, integer]), ({ comment, value }, ctx) => ({
    defname: "cache",
    defaction: 0,
    arg: { Integer: { ival: value[1] } },
    location: ctx.pos,
    comment,
  })),
  transform(
    phrase([START, optional(WITH), integer]),
    ({ comment, value }, ctx) => ({
      defname: "start",
      defaction: 0,
      arg: { Integer: { ival: value[2] } },
      location: ctx.pos,
      comment,
    })
  ),
  transform(
    phrase([INCREMENT, optional(BY), integer]),
    ({ comment, value }, ctx) => ({
      defname: "increment",
      defaction: 0,
      arg: { Integer: { ival: value[2] } },
      location: ctx.pos,
      comment,
    })
  ),
]);

const ifNotExists = phrase([IF, NOT, EXISTS]);

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
                comment: combineComments(
                  b.comment,
                  b.value.comment,

                  // If this is the last item add the inline comment after semicolon.
                  v[2] && i === v[2].value.length - 1
                    ? inlineCommentAfterSemiColon
                    : ""
                ),
              },
            })),
          }
        : {}),
      ...(v[0].value[2] ? { if_not_exists: true } : {}),
      comment: combineComments(
        v[0].comment,
        v[1],
        v[2]?.comment,
        !hasList ? inlineCommentAfterSemiColon : "" // <-- include comment after semicolon only if there is no list.
      ),
    };
  }
);

createSeqStmt.identifier = "createSeqStmt";
