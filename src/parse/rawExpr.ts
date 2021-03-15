import {
  Rule,
  or,
  transform,
  sequence,
  optional,
  constant,
  identifier,
  OR,
  AND,
  __,
  combineComments,
  // maybeInParens,
  LPAREN,
  RPAREN,
} from "./util";
import { aConst } from "./aConst";
import { typeCast } from "./typeCast";
import { funcCall } from "./funcCall";
import { RawValue, RawCondition, BoolOp, BoolExpr } from "../types";
import { columnRef } from "./columnRef";
import { notBoolExpr } from "./boolExpr";
import { rowExpr } from "./rowExpr";

// Pur parser will nest each bool argument in a BoolExpr, but we want to keep them all flat in args.
// SELECT FALSE AND FALSE AND FALSE;
function condenseBoolArguments(
  exisitingArgs: RawCondition[],
  boolop: BoolOp,
  hasParens: boolean
) {
  if (hasParens) {
    return exisitingArgs;
  }

  let args: RawCondition[] = [];
  for (const arg of exisitingArgs) {
    if ("BoolExpr" in arg && boolop === arg.BoolExpr.boolop) {
      // If the operation is the same, lets flatten this structure.
      args = args.concat(arg.BoolExpr.args);
    } else {
      args.push(arg);
    }
  }

  return args;
}

// We need to make some rearranging to make sure our AST matches postgres.
function condenseNestedBoolExpressions(
  boolExpr: BoolExpr,
  { hasParens }: { hasParens: boolean }
): BoolExpr {
  // Since "AND" takes precedence, if the child is an "OR", lets move it to the top
  // SELECT TRUE AND FALSE OR TRUE
  //        ^^^^^^^^^^^^^^
  //        THis becomes argument 1 now
  //        whereas before it was grouped like:
  //        TRUE AND (FALSE OR TRUE)
  if (
    "BoolExpr" in boolExpr.args[1] &&
    boolExpr.boolop === BoolOp.AND && // If Parent is AND
    boolExpr.args[1].BoolExpr.boolop === BoolOp.OR && // Child is OR
    !hasParens
  ) {
    return {
      boolop: BoolOp.OR,
      args: [
        {
          BoolExpr: {
            boolop: BoolOp.AND,
            location: boolExpr.location,
            //   const subArgs =
            //     "BoolExpr" in v[3].value.BoolExpr.args[0] &&
            //     v[3].value.BoolExpr.args[0].BoolExpr.boolop === BoolOp.AND
            //       ? v[3].value.BoolExpr.args[0].BoolExpr.args
            //       : [v[3].value.BoolExpr.args[0]];
            args: condenseBoolArguments(
              [boolExpr.args[0], boolExpr.args[1].BoolExpr.args[0]],
              BoolOp.AND,
              false
            ),
          },
        },
        ...condenseBoolArguments(
          boolExpr.args[1].BoolExpr.args.slice(1),
          BoolOp.OR,
          false
        ),
      ],
      location: boolExpr.args[1].BoolExpr.location,
    };
  }

  boolExpr.args = condenseBoolArguments(
    boolExpr.args,
    boolExpr.boolop,
    hasParens
  );
  return boolExpr;
}

// This should include equestions and type casts.
export const rawValue: Rule<{
  value: RawValue;
  codeComment: string;
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      transform(typeCast, (TypeCast) => ({
        value: { TypeCast },
        codeComment: "",
      })), // intentially before aConst
      transform(aConst, (A_Const) => ({ value: { A_Const }, codeComment: "" })),
      transform(funcCall, ({ value, codeComment }) => ({
        value: { FuncCall: value },
        codeComment,
      })),
      transform(columnRef, (value) => ({
        value: { ColumnRef: value },
        codeComment: "",
      })),
      transform(rowExpr, ({ value, codeComment }) => ({
        value: { RowExpr: value },
        codeComment,
      })),
    ]),
    optional(
      transform(
        sequence([
          __,
          transform(constant("::"), (value, ctx) => ({
            value,
            pos: ctx.pos,
          })),
          __,
          transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
        ]),
        (value, ctx) => ({ TypeCast: { value, ctx } })
      )
    ),
  ]),
  (s) => {
    if (s[1]) {
      const firstRawExpr = s[0];
      if ("TypeCast" in s[1]) {
        const { value: v } = s[1].TypeCast;
        return {
          codeComment: combineComments(firstRawExpr.codeComment, v[0], v[2]),
          value: {
            TypeCast: {
              arg: firstRawExpr.value,
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
              location: v[1].pos,
            },
          },
        };
      }
    }

    return s[0];
  }
);

export const rawCondition: Rule<{
  value: RawCondition;
  codeComment: string;
  hasParens?: boolean;
}> = transform(
  sequence([
    or([
      // We do rawValue here to prevent circular call stacks.
      rawValue,

      // NOT XXX
      transform(notBoolExpr, ({ value, codeComment }) => ({
        value: { BoolExpr: value },
        codeComment,
      })),
      // We can use _rawExpr since we are matching parens here.
      transform(
        sequence([LPAREN, __, (ctx) => rawCondition(ctx), __, RPAREN]),
        (v) => ({ ...v[2], hasParens: true })
      ),
    ]),
    optional(
      or([
        // AND / OR
        or([
          transform(
            sequence([__, AND, __, (ctx) => rawCondition(ctx)]),
            (value, ctx) => {
              return { BoolExpr: { value, ctx } };
            }
          ),
          transform(
            sequence([__, OR, __, (ctx) => rawCondition(ctx)]),
            (value, ctx) => {
              return { BoolExpr: { value, ctx } };
            }
          ),
        ]),

        // aExpr
        transform(
          sequence([__, constant("="), __, (ctx) => rawValue(ctx)]),
          (value, ctx) => {
            return { A_Expr: { value, ctx } };
          }
        ),
      ])
    ),
  ]),
  (s) => {
    if (s[1]) {
      const firstRawExpr = s[0];

      if ("BoolExpr" in s[1]) {
        const { value: v } = s[1].BoolExpr;
        const boolop = v[1].value === "OR" ? BoolOp.OR : BoolOp.AND;

        return {
          value: {
            BoolExpr: condenseNestedBoolExpressions(
              {
                boolop,
                args: [
                  firstRawExpr.value, // <-- Will be set below
                  v[3].value,
                ],
                location: v[1].start,
              },
              { hasParens: !!v[3].hasParens }
            ),
          },
          codeComment: combineComments(
            firstRawExpr.codeComment,
            v[0],
            v[2],
            v[3].codeComment
          ),
        };
      } else if ("A_Expr" in s[1]) {
        const { value: v } = s[1].A_Expr;
        return {
          codeComment: combineComments(
            firstRawExpr.codeComment,
            v[0],
            v[2],
            v[3].codeComment
          ),
          value: {
            A_Expr: {
              kind: 0,
              name: [
                {
                  String: {
                    str: v[1].value,
                  },
                },
              ],
              lexpr: firstRawExpr.value as RawValue, // TODO ... this currently allows "(1 AND 1) = 'foo'". Fix in the future.
              rexpr: v[3].value,
              location: v[1].start,
            },
          },
        };
      }
    }

    return s[0];
  }
);
