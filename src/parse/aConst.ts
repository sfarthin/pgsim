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
} from "./util";
import { A_Const } from "../types";

export const aConstInteger = transform(oneToMany(NUMERAL), (s) => ({
  Integer: { ival: Number(s.join("")) },
}));

const aConstFloat = transform(
  sequence([oneToMany(NUMERAL), PERIOD, oneToMany(NUMERAL)]),
  (s) => ({
    Float: { str: `${s[0].join("")}.${s[2].join("")}` },
  })
);

const nullKeyword = transform(constant("null"), () => ({
  Null: {},
}));

const aConstKeyword = transform(
  or([constant("on"), constant("off"), constant("false"), constant("warning")]),
  (s) => ({ String: { str: s.value } })
);

const aConstString = transform(quotedString, (v) => ({
  String: { str: v },
}));

export const aConst: Rule<A_Const> = transform(
  or([aConstString, aConstInteger, aConstFloat, nullKeyword, aConstKeyword]),
  (s, ctx) => ({
    val: s,
    location: ctx.pos,
  })
);
