import {
  transform,
  oneToMany,
  keyword,
  or,
  quotedString,
  Rule,
  float,
  fromBufferToCodeBlock,
  __,
  regexChar,
} from "./util";
import { A_Const } from "../types";

export const aConstInteger = fromBufferToCodeBlock(
  (ctx) =>
    transform(oneToMany(regexChar(/[0-9]/)), (s, ctx) => {
      return {
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
      };
    })(ctx),
  (text) => {
    return [[{ type: "numberLiteral", text }]];
  }
);

const aConstFloat = transform(float, (str) => ({
  value: {
    Float: { str },
  },
  codeComment: "",
}));

const nullKeyword = transform(keyword("null" as any), () => ({
  value: {
    Null: {},
  },
  codeComment: "",
}));

const aConstKeyword = transform(
  or([
    keyword("on" as any),
    keyword("off" as any),
    keyword("false" as any),
    keyword("true" as any),
    keyword("warning" as any),
    keyword("content" as any),
    keyword("heap" as any),
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

export function negateAConst(aConst: A_Const): A_Const {
  if ("String" in aConst.val || "Null" in aConst.val) {
    // consider throwing an error
    return aConst;
  }

  if ("Integer" in aConst.val) {
    const hasMinus = aConst.val.Integer.ival < 0;
    return {
      val: {
        Integer: {
          ival: aConst.val.Integer.ival * -1,
        },
      },
      location: aConst.location - (!hasMinus ? 1 : 0),
    };
  }

  if ("Float" in aConst.val) {
    const hasMinus = aConst.val.Float.str.match(/^\-/);
    const minus = !hasMinus ? "-" : "";
    return {
      val: {
        Float: {
          str: `${minus}${aConst.val.Float.str.replace(/^\-/, "")}`,
        },
      },
      location: aConst.location,
    };
  }

  throw new Error("Unexpected Constant");
}
