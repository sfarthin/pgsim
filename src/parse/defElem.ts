import {
  transform,
  Rule,
  phrase,
  optional,
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
} from "./util";
import { DefElem } from "~/types";

export const defElem: Rule<DefElem> = or([
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
