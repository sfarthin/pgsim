import { BoolExpr, BoolOp } from "../types";
import { rawValue, connectRawValue } from "./rawExpr";
import { RawValue } from "../types";
import {
  sequence,
  transform,
  Rule,
  __,
  combineComments,
  NOT,
  AND,
  OR,
  or,
  Context,
} from "./util";

// Pur parser will nest each bool argument in a BoolExpr, but we want to keep them all flat in args.
// SELECT FALSE AND FALSE AND FALSE;
function condenseBoolArguments(
  exisitingArgs: RawValue[],
  boolop: BoolOp,
  hasParens: boolean
) {
  if (hasParens) {
    return exisitingArgs;
  }

  let args: RawValue[] = [];
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

export const notBoolExpr: Rule<{
  value: { BoolExpr: BoolExpr };
  codeComment: string;
}> = transform(sequence([NOT, __, (ctx) => rawValue(ctx)]), (v, ctx) => {
  return {
    value: {
      BoolExpr: {
        boolop: BoolOp.NOT,
        args: [v[2].value],
        location: ctx.pos,
      },
    },
    codeComment: combineComments(v[1], v[2].codeComment),
  };
});

export const boolConnection = (ctx: Context) =>
  connectRawValue(
    sequence([__, or([AND, OR]), __, (ctx) => rawValue(ctx)]),
    (c1, v) => {
      return {
        value: {
          BoolExpr: condenseNestedBoolExpressions(
            {
              boolop: v[1].value === "AND" ? BoolOp.AND : BoolOp.OR,
              args: [c1.value, v[3].value],
              location: v[1].start,
            },
            { hasParens: "hasParens" in v[3] && !!v[3].hasParens }
          ),
        },
        codeComment: combineComments(
          c1.codeComment,
          v[0],
          v[2],
          v[3].codeComment
        ),
      };
    }
  )(ctx);
