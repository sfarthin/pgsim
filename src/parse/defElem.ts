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
import { DefElem } from "../types";

export const defElem: Rule<DefElem> = or([
  transform(phrase([OWNED, BY, NONE]), (v, ctx) => ({
    defname: "owned_by",
    arg: [{ String: { str: "none" } }],
    defaction: 0,
    location: ctx.pos,
    codeComment: v.codeComment,
  })),
  transform(
    phrase([OWNED, BY, tableIdentifier]),
    ({ codeComment, value }, ctx) => ({
      defname: "owned_by",
      defaction: 0,
      arg: value[2].map((str) => ({ String: { str } })),
      location: ctx.pos,
      codeComment,
    })
  ),
  transform(phrase([NO, CYCLE]), (v, ctx) => ({
    defname: "cycle",
    defaction: 0,
    arg: { Integer: { ival: 0 } },
    location: ctx.pos,
    codeComment: v.codeComment,
  })),
  transform(phrase([NO, MAXVALUE]), ({ codeComment }, ctx) => ({
    defname: "maxvalue",
    defaction: 0,
    location: ctx.pos,
    codeComment,
  })),
  transform(phrase([NO, MINVALUE]), ({ codeComment }, ctx) => ({
    defname: "minvalue",
    defaction: 0,
    location: ctx.pos,
    codeComment,
  })),
  transform(phrase([NO, CACHE]), ({ codeComment }, ctx) => ({
    defname: "cache",
    defaction: 0,
    location: ctx.pos,
    codeComment,
  })),
  transform(phrase([CYCLE]), ({ codeComment }, ctx) => ({
    defname: "cycle",
    defaction: 0,
    arg: { Integer: { ival: 1 } },
    location: ctx.pos,
    codeComment,
  })),
  transform(phrase([MAXVALUE, integer]), ({ value, codeComment }, ctx) => ({
    defname: "maxvalue",
    defaction: 0,
    arg: { Integer: { ival: value[1] } },
    location: ctx.pos,
    codeComment,
  })),
  transform(phrase([MINVALUE, integer]), ({ codeComment, value }, ctx) => ({
    defname: "minvalue",
    defaction: 0,
    arg: { Integer: { ival: value[1] } },
    location: ctx.pos,
    codeComment,
  })),
  transform(phrase([CACHE, integer]), ({ codeComment, value }, ctx) => ({
    defname: "cache",
    defaction: 0,
    arg: { Integer: { ival: value[1] } },
    location: ctx.pos,
    codeComment,
  })),
  transform(
    phrase([START, optional(WITH), integer]),
    ({ codeComment, value }, ctx) => ({
      defname: "start",
      defaction: 0,
      arg: { Integer: { ival: value[2] } },
      location: ctx.pos,
      codeComment,
    })
  ),
  transform(
    phrase([INCREMENT, optional(BY), integer]),
    ({ codeComment, value }, ctx) => ({
      defname: "increment",
      defaction: 0,
      arg: { Integer: { ival: value[2] } },
      location: ctx.pos,
      codeComment,
    })
  ),
]);
