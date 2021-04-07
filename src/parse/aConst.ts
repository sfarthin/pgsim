import {
  transform,
  oneToMany,
  constant,
  sequence,
  or,
  NUMERAL,
  PERIOD,
  quotedString,
  Rule,
  optional,
  MINUS,
} from "./util";
import { A_Const } from "../types";

export const aConstInteger = transform(
  sequence([optional(MINUS), oneToMany(NUMERAL)]),
  (s) => ({
    Integer: { ival: Number(s[1].join("")) * (s[0] ? -1 : 1) },
  })
);

const aConstFloat = transform(
  sequence([optional(MINUS), oneToMany(NUMERAL), PERIOD, oneToMany(NUMERAL)]),
  (s) => ({
    Float: { str: `${s[0] ? "-" : ""}${s[1].join("")}.${s[3].join("")}` },
  })
);

const nullKeyword = transform(constant("null"), () => ({
  Null: {},
}));

const aConstKeyword = transform(
  or([
    constant("on"),
    constant("off"),
    constant("false"),
    constant("true"),
    constant("warning"),
    constant("content"),
    constant("heap"),
  ]),
  (s) => ({ String: { str: s.value } })
);

const aConstString = transform(quotedString, (v) => ({
  String: { str: v },
}));

export const aConst: Rule<A_Const> = transform(
  or([
    aConstString,
    aConstFloat,
    // integer need to be after float
    aConstInteger,
    nullKeyword,
    aConstKeyword,
  ]),
  (s, ctx) => ({
    val: s,
    location: ctx.pos,
  })
);
