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
  __,
} from "./util";
import { A_Const } from "../types";

export const aConstInteger = transform(
  sequence([optional(MINUS), __, oneToMany(NUMERAL)]),
  (s, ctx) => ({
    value: {
      Integer: { ival: Number(s[2].join("")) * (s[0] ? -1 : 1) },
    },
    codeComment: s[1],
    location: ctx.pos,
  })
);

const aConstFloat = transform(
  sequence([
    optional(MINUS),
    __,
    oneToMany(NUMERAL),
    PERIOD,
    oneToMany(NUMERAL),
  ]),
  (s) => ({
    value: {
      Float: { str: `${s[0] ? "-" : ""}${s[2].join("")}.${s[4].join("")}` },
    },
    codeComment: s[1],
  })
);

const nullKeyword = transform(constant("null"), () => ({
  value: {
    Null: {},
  },
  codeComment: "",
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
  (s) => ({ value: { String: { str: s.value } }, codeComment: "" })
);

const aConstString = transform(quotedString, (v) => ({
  value: {
    String: { str: v.value },
  },
  codeComment: "",
}));

export const aConst: Rule<{
  value: { A_Const: A_Const };
  codeComment: string;
}> = transform(
  or([
    aConstString,
    aConstFloat,
    // integer need to be after float
    aConstInteger,
    nullKeyword,
    aConstKeyword,
  ]),
  (s, ctx) => ({
    value: {
      A_Const: {
        val: s.value,
        location: ctx.pos,
      },
    },
    codeComment: s.codeComment,
  })
);
