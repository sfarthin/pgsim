import {
  transform,
  Rule,
  zeroToMany,
  sequence,
  __,
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
  combineComments,
} from "./util";
import { DefElem } from "../types";

export const defElem: Rule<DefElem> = or([
  transform(sequence([OWNED, __, BY, __, NONE]), (v, ctx) => ({
    defname: "owned_by",
    arg: [{ String: { str: "none" } }],
    defaction: 0,
    location: ctx.pos,
    codeComment: combineComments(v[1], v[3]),
  })),
  transform(sequence([OWNED, __, BY, __, tableIdentifier]), (v, ctx) => ({
    defname: "owned_by",
    defaction: 0,
    arg: v[4].map((str) => ({ String: { str } })),
    location: ctx.pos,
    codeComment: combineComments(v[1], v[3]),
  })),
  transform(sequence([NO, __, CYCLE]), (v, ctx) => ({
    defname: "cycle",
    defaction: 0,
    arg: { Integer: { ival: 0 } },
    location: ctx.pos,
    codeComment: combineComments(v[1]),
  })),
  transform(sequence([NO, __, MAXVALUE]), (v, ctx) => ({
    defname: "maxvalue",
    defaction: 0,
    location: ctx.pos,
    codeComment: v[1],
  })),
  transform(sequence([NO, __, MINVALUE]), (v, ctx) => ({
    defname: "minvalue",
    defaction: 0,
    location: ctx.pos,
    codeComment: v[1],
  })),
  transform(sequence([NO, __, CACHE]), (v, ctx) => ({
    defname: "cache",
    defaction: 0,
    location: ctx.pos,
    codeComment: v[1],
  })),
  transform(CYCLE, (v, ctx) => ({
    defname: "cycle",
    defaction: 0,
    arg: { Integer: { ival: 1 } },
    location: ctx.pos,
    codeComment: "",
  })),
  transform(sequence([MAXVALUE, __, integer]), (v, ctx) => ({
    defname: "maxvalue",
    defaction: 0,
    arg: { Integer: { ival: v[2] } },
    location: ctx.pos,
    codeComment: v[1],
  })),
  transform(sequence([MINVALUE, __, integer]), (v, ctx) => ({
    defname: "minvalue",
    defaction: 0,
    arg: { Integer: { ival: v[2] } },
    location: ctx.pos,
    codeComment: v[1],
  })),
  transform(sequence([CACHE, __, integer]), (v, ctx) => ({
    defname: "cache",
    defaction: 0,
    arg: { Integer: { ival: v[2] } },
    location: ctx.pos,
    codeComment: v[1],
  })),
  transform(sequence([START, __, optional(WITH), __, integer]), (v, ctx) => ({
    defname: "start",
    defaction: 0,
    arg: { Integer: { ival: v[4] } },
    location: ctx.pos,
    codeComment: combineComments(v[1], v[3]),
  })),
  transform(sequence([INCREMENT, __, optional(BY), __, integer]), (v, ctx) => ({
    defname: "increment",
    defaction: 0,
    arg: { Integer: { ival: v[4] } },
    location: ctx.pos,
    codeComment: combineComments(v[1], v[3]),
  })),
]);

export const defElemList = transform(zeroToMany(sequence([__, defElem])), (v) =>
  v.map((r) => ({
    DefElem: {
      ...r[1],
      codeComment: r[0],
    },
  }))
);
