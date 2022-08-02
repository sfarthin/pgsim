import {
  or,
  Rule,
  transform,
  sequence,
  __,
  combineComments,
  Context,
  keyword,
  quotedString,
  symbol,
} from "./util";
import { TypeCast } from "~/types";
import { rawValuePostfix } from "./rawExpr";
import { typeName } from "./typeName";

const booleanLiteral: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = transform(
  or([keyword("true" as any), keyword("false" as any)]),
  ({ value }, ctx) => {
    return {
      value: {
        TypeCast: {
          arg: {
            A_Const: {
              val: {
                String: { str: value.toLowerCase() === "true" ? "t" : "f" },
              },
              location: ctx.pos,
            },
          },
          typeName: {
            names: [
              { String: { str: "pg_catalog" } },
              { String: { str: "bool" } },
            ],
            typemod: -1,
            location: -1,
          },
          location: -1,
        },
      },
      codeComment: "",
    };
  }
);

export const typeCast: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = booleanLiteral;

export const typeCastLiteral: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = transform(sequence([__, __, typeName, __, quotedString]), (v) => {
  return {
    codeComment: combineComments(v[1], v[2].codeComment, v[3]),
    value: {
      TypeCast: {
        arg: {
          A_Const: {
            val: { String: { str: v[4].value } },
            location: v[4].pos,
          },
        },
        typeName: v[2].value,
        location: -1,
      },
    },
  };
});

export const typeCastConnection = (ctx: Context) =>
  rawValuePostfix(sequence([__, symbol("::"), __, typeName]), (c1, v) => {
    return {
      codeComment: combineComments(
        c1.codeComment,
        v[0],
        v[2],
        v[3].codeComment
      ),
      value: {
        TypeCast: {
          arg: c1.value,
          typeName: v[3].value,
          location: v[1].start,
        },
      },
    };
  })(ctx);
