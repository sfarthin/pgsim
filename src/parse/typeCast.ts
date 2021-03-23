import { or, Rule, constant, transform } from "./util";
import { TypeCast } from "../types";

const booleanLiteral: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = transform(or([constant("true"), constant("false")]), ({ value }, ctx) => {
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
          TypeName: {
            names: [
              { String: { str: "pg_catalog" } },
              { String: { str: "bool" } },
            ],
            typemod: -1,
            location: -1,
          },
        },
        location: -1,
      },
    },
    codeComment: "",
  };
});

export const typeCast: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = booleanLiteral;
