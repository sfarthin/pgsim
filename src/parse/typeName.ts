import {
  or,
  keyword,
  transform,
  Rule,
  LPAREN,
  RPAREN,
  COMMA,
  sequence,
  __,
  combineComments,
  identifier,
} from "./util";
import { aConstInteger } from "./aConst";
import { A_Const, TypeName } from "~/types";
import {
  includesReferenceCatalog,
  typeOrAlias,
  types,
  defaultTypeMods,
} from "~/constants";

const keywordSet = (arr: string[]): Rule<string> =>
  or(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arr.map((s) => transform(keyword(s as any), (v) => v.value)) as [
      Rule<string>
    ]
  );

const colTypeWithParam = keywordSet(
  types.flatMap((t) => (t.maxParams > 0 ? [...t.alias, t.name] : []))
);

const colTypeWithDoubleParam = keywordSet(
  types.flatMap((t) => (t.maxParams === 2 ? [...t.alias, t.name] : []))
);

const colTypeNoParam = keywordSet(typeOrAlias);

const getNames = (col: string): TypeName["names"] => {
  const base = includesReferenceCatalog.includes(col.toLowerCase() as any)
    ? [{ String: { str: "pg_catalog" } }]
    : [];

  const c = col.toLowerCase();
  const matchedName = types.find(
    (t) => t.name === c || (t.alias as readonly string[]).includes(c)
  )?.name;

  // @ts-expect-error  -- we know we have exactly 2 here
  return base.concat({
    String: {
      str: (matchedName ?? col).toLowerCase(),
    },
  });
};

const typeNameWithTwoParams: Rule<{
  value: TypeName;
  codeComment: string;
}> = transform(
  sequence([
    colTypeWithDoubleParam,
    __,
    LPAREN,
    __,
    aConstInteger, // 4
    __,
    COMMA,
    __,
    aConstInteger,
    __,
    RPAREN,
  ]),
  (value, ctx) => {
    return {
      value: {
        names: getNames(value[0]),
        typemod: -1,
        typmods: [value[4].value, value[8].value],
        location: ctx.pos,
      },
      codeComment: combineComments(
        value[1],
        value[3],
        value[4].codeComment,
        value[5],
        value[7],
        value[8].codeComment,
        value[9]
      ),
    };
  }
);

const typeNameWithParam: Rule<{
  value: TypeName;
  codeComment: string;
}> = transform(
  sequence([colTypeWithParam, __, LPAREN, __, aConstInteger, __, RPAREN]),
  (value, ctx) => {
    return {
      value: {
        names: getNames(value[0]),
        typemod: -1,
        typmods: [value[4].value],
        location: ctx.pos,
      },
      codeComment: combineComments(value[1], value[3], value[5]),
    };
  }
);

const typeNameWithNoParam: Rule<{
  value: TypeName;
  codeComment: string;
}> = transform(or([colTypeNoParam, identifier]), (value, ctx) => {
  const col = value;
  const typmods = defaultTypeMods[
    col.toLowerCase() as keyof typeof defaultTypeMods
  ]
    ? ([
        {
          A_Const: {
            val: {
              Integer: {
                ival: defaultTypeMods[
                  col.toLowerCase() as keyof typeof defaultTypeMods
                ],
              },
            },
            location: col.toLowerCase().match("interval") ? ctx.pos + 9 : -1,
          },
        },
      ] as [{ A_Const: A_Const }])
    : null;
  return {
    value: {
      names: getNames(value),
      typemod: -1,
      ...(typmods ? { typmods } : {}),
      location: ctx.pos,
    },
    codeComment: "",
  };
});

export const typeName: Rule<{ value: TypeName; codeComment: string }> = or([
  typeNameWithTwoParams,
  typeNameWithParam,
  typeNameWithNoParam,
]);
