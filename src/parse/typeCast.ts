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
import {
  TypeCast,
  TypeName,
  TypeNameKeyword,
  typeNames,
  getTypeDetails,
} from "../types";
import { rawValuePostfix } from "./rawExpr";

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
const typeNameRule: Rule<{ start: number; value: TypeNameKeyword }> = or(
  typeNames.map((typeName) => keyword(typeName)) as any
);

export const typeCastLiteral: Rule<{
  value: { TypeCast: TypeCast };
  codeComment: string;
}> = transform(sequence([__, __, typeNameRule, __, quotedString]), (v) => {
  const typeName = v[2].value;
  const parsedType = getTypeDetails(typeName);

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
            ] as TypeName["names"],
            typemod: -1,
            location: v[2].start,
          },
        },
        location: -1,
      },
    },
  };
});

export const typeCastConnection = (ctx: Context) =>
  rawValuePostfix(sequence([__, constant("::"), __, typeNameRule]), (c1, v) => {
    const typeName = v[3].value;
    const parsedType = getTypeDetails(typeName);

    return {
      codeComment: combineComments(c1.codeComment, v[0], v[2]),
      value: {
        TypeCast: {
          arg: c1.value,
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
              ] as TypeName["names"],
              typemod: -1,
              location: v[3].start,
            },
          },
          location: v[1].start,
        },
      },
    };
  })(ctx);
