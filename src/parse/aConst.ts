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
import { A_Const, A_Const_Float, A_Const_Null, A_Const_String } from "~/types";

export const aConstInteger: Rule<{
  value: { A_Const: A_Const };
  codeComment: string;
}> = fromBufferToCodeBlock(
  (ctx) =>
    transform(oneToMany(regexChar(/[0-9]/)), (s, ctx) => {
      if (BigInt(s.join("")) > BigInt("2147483647")) {
        return {
          value: {
            A_Const: {
              val: {
                Float: { str: s.join("") },
              },
              location: ctx.pos,
            },
          },
          codeComment: "",
        };
      }

      return {
        value: {
          A_Const: {
            val: {
              Integer: { ival: Number(s.join("")) },
            },
            location: ctx.pos,
          },
        },
        codeComment: "",
      };
    })(ctx),
  (text) => {
    return [[{ type: "numberLiteral", text }]];
  }
);

export const aConstFloat: Rule<{
  value: { A_Const: A_Const_Float };
  codeComment: string;
}> = transform(float, (str, ctx) => ({
  value: {
    A_Const: {
      val: { Float: { str } },
      location: ctx.pos,
    },
  },
  codeComment: "",
}));

export const nullKeyword: Rule<{
  value: { A_Const: A_Const_Null };
  codeComment: string;
}> = transform(keyword("null" as any), (_v, ctx) => ({
  value: {
    A_Const: {
      val: { Null: {} },
      location: ctx.pos,
    },
  },
  codeComment: "",
}));

const aConstKeyword: Rule<{
  value: { A_Const: A_Const };
  codeComment: string;
}> = transform(
  or([
    keyword("on" as any),
    keyword("off" as any),
    keyword("false" as any),
    keyword("true" as any),
    keyword("warning" as any),
    keyword("content" as any),
    keyword("heap" as any),
  ]),
  (s, ctx) => ({
    value: {
      A_Const: { val: { String: { str: s.value } }, location: ctx.pos },
    },
    codeComment: "",
  })
);

export const aConstString: Rule<{
  value: { A_Const: A_Const_String };
  codeComment: string;
}> = transform(quotedString, (v, ctx) => ({
  value: {
    A_Const: {
      val: { String: { str: v.value } },
      location: ctx.pos,
    },
  },
  codeComment: "",
}));

export const aConst: Rule<{
  value: { A_Const: A_Const };
  codeComment: string;
}> = or([
  aConstString,
  aConstFloat,
  // integer need to be after float
  aConstInteger,
  nullKeyword,
  aConstKeyword,
]);

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
