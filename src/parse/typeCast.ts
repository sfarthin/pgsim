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
  keyword,
  quotedString,
  optional,
  MINUS,
} from "./util";
import { TypeCast, TypeNameKeyword, stringToType } from "../types";
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

// TODO we will want to get a canoical list
const typeCastFormat = or([
  keyword("date" as any),
  keyword("integer" as any),
  keyword("interval" as any),
  keyword("time" as any),
  keyword("timestamp" as any),
  keyword("double precision" as any),
]);

export const typeCastLiteral: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = transform(
  sequence([optional(MINUS), __, typeCastFormat, __, quotedString]),
  (v) => {
    const parsedType = stringToType(v[2].value);

    return {
      codeComment: combineComments(v[1], v[3]),
      value: {
        TypeCast: {
          arg: {
            A_Const: {
              val: { String: { str: v[4].value } },
              location: v[4].pos,
            },
          },
          typeName: {
            TypeName: {
              names: [
                ...(parsedType.hasPGCatalog
                  ? [
                      {
                        String: {
                          str: "pg_catalog",
                        },
                      },
                    ]
                  : []),
                {
                  String: {
                    str: parsedType.name,
                  },
                },
              ],
              typemod: -1,
              location: v[2].start,
            },
          },
          location: -1,
        },
      },
    };
  }
);

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
                      str: v[3].value as TypeNameKeyword,
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
