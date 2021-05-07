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
  __,
} from "./util";
import { A_Const } from "../types";

export const aConstInteger = transform(oneToMany(NUMERAL), (s, ctx) => ({
  value:
    BigInt(s.join("")) > BigInt("2147483647")
      ? {
          Float: { str: s.join("") },
        }
      : {
          Integer: { ival: Number(s.join("")) },
        },
  codeComment: "",
  location: ctx.pos,
}));

const aConstFloat = transform(
  sequence([oneToMany(NUMERAL), PERIOD, oneToMany(NUMERAL)]),
  (s) => ({
    value: {
      Float: { str: `${s[0].join("")}.${s[2].join("")}` },
    },
    codeComment: "",
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
