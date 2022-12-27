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
  optional,
  constant,
  fromBufferToCodeBlock,
  PERIOD,
} from "./util";
import { aConstInteger } from "./aConst";
import { A_Const, TypeName, TypeNameArrayBounds } from "~/types";
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

const getNames = (
  col: string,
  namespace?: string | null
): TypeName["names"] => {
  if (namespace) {
    // THis is likely an enum.
    return [
      {
        String: {
          str: namespace,
        },
      },
      {
        String: {
          str: col,
        },
      },
    ] as any;
  }

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

const typeNameArray: Rule<{ arrayBounds: TypeNameArrayBounds }> = transform(
  fromBufferToCodeBlock(constant("[]"), (text) => [
    [{ type: "keyword", text }],
  ]),
  () => ({
    arrayBounds: [
      {
        Integer: {
          ival: -1,
        },
      },
    ],
  })
);

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
    optional(typeNameArray),
  ]),
  (value, ctx) => {
    return {
      value: {
        names: getNames(value[0]),
        typemod: -1,
        typmods: [value[4].value, value[8].value],
        location: ctx.pos,
        ...value[11],
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
  sequence([
    colTypeWithParam,
    __,
    LPAREN,
    __,
    aConstInteger,
    __,
    RPAREN,
    optional(typeNameArray),
  ]),
  (value, ctx) => {
    return {
      value: {
        names: getNames(value[0]),
        typemod: -1,
        typmods: [value[4].value],
        location: ctx.pos,
        ...value[7],
      },
      codeComment: combineComments(value[1], value[3], value[5]),
    };
  }
);

const typeNameWithNoParam: Rule<{
  value: TypeName;
  codeComment: string;
}> = transform(
  sequence([
    or([
      colTypeNoParam,
      sequence([optional(sequence([identifier, PERIOD])), identifier]),
    ]),
    optional(typeNameArray),
  ]),
  (v, ctx) => {
    const col = typeof v[0] === "string" ? v[0] : v[0][1];
    const namespace =
      typeof v[0] === "string" || v[0][0] == null ? undefined : v[0][0][0];
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
        names: getNames(col, namespace),
        typemod: -1,
        ...(typmods ? { typmods } : {}),
        location: ctx.pos,
        ...v[1],
      },
      codeComment: "",
    };
  }
);

export const typeName: Rule<{ value: TypeName; codeComment: string }> = or([
  typeNameWithTwoParams,
  typeNameWithParam,
  typeNameWithNoParam,
]);
