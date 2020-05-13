import {
  guard,
  constant,
  string,
  number,
  object,
  Decoder,
  array,
  mixed,
  either,
  either3,
  dict,
  optional,
} from "decoders";
import {
  StringValue,
  stringDecoder,
  Constant,
  constantDecoder,
  A_Const,
  aConstDecoder,
} from "./constant";

type Field = { String: StringValue };

const fieldDecoder: Decoder<Field> = object({
  String: stringDecoder,
});

export type ColumnRef = {
  fields: Field[];
  location: number;
};

const columnRefDecoder: Decoder<ColumnRef> = object({
  fields: array(fieldDecoder),
  location: number,
});

export type FuncCall =
  | {
      funcname: {
        String: {
          str: string;
        };
      }[];
      args: any[]; // <-- Should be TargetValue, but that is cyclic, so we have to do it at runtime
    }
  // Same as above but with agg_star
  | {
      funcname: {
        String: {
          str: string;
        };
      }[];
      agg_star: boolean;
    };

export const funcCallDecoder: Decoder<FuncCall> = either(
  object({
    funcname: array(object({ String: object({ str: string }) })),
    args: array(mixed),
  }),
  object({
    funcname: array(object({ String: object({ str: string }) })),
    agg_star: constant(true),
  })
);

export type TargetValue =
  | { ColumnRef: ColumnRef }
  | { FuncCall: FuncCall }
  | { A_Const: A_Const };

const targetValueDecoder: Decoder<TargetValue> = either3(
  object({ ColumnRef: columnRefDecoder }),
  object({ FuncCall: funcCallDecoder }),
  object({ A_Const: aConstDecoder })
);

export const verifyTargetValue = guard(targetValueDecoder);

export type ResTarget = {
  name: string | void;
  val: TargetValue;
  location: number;
};

const resTargetDecoder: Decoder<ResTarget> = object({
  name: optional(string),
  val: targetValueDecoder,
  location: number,
});

export type RangeVar = {
  relname: string;
  inhOpt: number;
  relpersistence: string;
  location: number;
};

const rangeVarDecoder: Decoder<RangeVar> = object({
  relname: string,
  inhOpt: number,
  relpersistence: string,
  location: number,
});

export type JoinExpr = {
  larg: object; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
  rarg: object; // <-- Should be FromClause, but that is cyclic, so we have to do it at runtime
  quals: any;
};

export const joinExprDecoder: Decoder<JoinExpr> = object({
  larg: dict(mixed),
  rarg: dict(mixed),
  quals: mixed,
});

export type RangeSubselect = {
  subquery: any; // <--- Need to decode it at runtime,
  alias: { Alias: { aliasname: string } }; // <-- Must have an alias when in from
};

export const rangeSubselectDecoder = object({
  subquery: mixed,
  alias: object({ Alias: object({ aliasname: string }) }),
});

export type FromClause =
  | { RangeVar: RangeVar }
  | { JoinExpr: JoinExpr }
  | { RangeSubselect: RangeSubselect };

export const FromClauseDecoder: Decoder<FromClause> = either3(
  object({ JoinExpr: joinExprDecoder }),
  object({ RangeVar: rangeVarDecoder }),
  object({ RangeSubselect: rangeSubselectDecoder }) // nested queries
);

export const verifyFromClause = guard(FromClauseDecoder);

export type SelectStmt = {
  targetList: { ResTarget: ResTarget }[];
  fromClause: FromClause[] | void;
  op: number;
};

export const selectStmtDecoder: Decoder<SelectStmt> = object({
  targetList: array(object({ ResTarget: resTargetDecoder })),
  fromClause: optional(array(FromClauseDecoder)),
  op: number,
});

export const verifySelectStatement = guard(selectStmtDecoder);

// {
//   "A_Expr": {
//     "kind": 0,
//     "name": [
//       {
//         "String": {
//           "str": "=",
//         },
//       },
//     ],
//     "lexpr": {
//       "ColumnRef": {
//         "fields": [
//           {
//             "String": {
//               "str": "location",
//             },
//           },
//           {
//             "String": {
//               "str": "user_id",
//             },
//           },
//         ],
//         "location": 58,
//       },
//     },
//     "rexpr": {
//       "ColumnRef": {
//         "fields": [
//           {
//             "String": {
//               "str": "users",
//             },
//           },
//           {
//             "String": {
//               "str": "id",
//             },
//           },
//         ],
//         "location": 77,
//       },
//     },
//     "location": 75,
//   }
