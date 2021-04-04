import {
  or,
  Rule,
  constant,
  transform,
  sequence,
  __,
  identifier,
  combineComments,
  Context,
} from "./util";
import { TypeCast } from "../types";
import { connectRawValue } from "./rawExpr";

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

export const typeCastConnection = (ctx: Context) =>
  connectRawValue(
    sequence([
      __,
      constant("::"),
      __,
      transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    ]),
    (c1, v) => {
      return {
        codeComment: combineComments(c1.codeComment, v[0], v[2]),
        value: {
          TypeCast: {
            arg: c1.value,
            typeName: {
              TypeName: {
                names: [
                  {
                    String: {
                      str: v[3].value,
                    },
                  },
                ],
                typemod: -1,
                location: v[3].pos,
              },
            },
            location: v[1].start,
          },
        },
      };
    }
  )(ctx);
