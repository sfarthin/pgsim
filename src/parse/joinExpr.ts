import {
  JoinExpr,
  JoinType,
  RangeSubselect,
  RangeVar,
  RawValue,
} from "~/types";
import { rawValue } from "./rawExpr";
import {
  transform,
  identifier,
  Rule,
  sequence,
  __,
  JOIN,
  ON,
  optional,
  or,
  INNER,
  LEFT,
  RIGHT,
  AS,
  combineComments,
  maybeInParens,
  OUTER,
  identifierIncludingKeyword,
  zeroToMany,
} from "./util";
import { rangeVar } from "./rangeVar";
import { rangeSubselect } from "./rangeSubselect";

type SomeJoin = {
  jointype: JoinType;
  arg:
    | {
        RangeVar: RangeVar;
        RangeSubselect?: undefined;
      }
    | {
        RangeSubselect: RangeSubselect;
        RangeVar?: undefined;
      };
  quals: RawValue;
};

const someJoin: Rule<{ value: SomeJoin; codeComment: string }> = transform(
  sequence([
    optional(
      or([
        INNER,
        RIGHT,
        transform(sequence([LEFT, __, OUTER]), () => ({
          value: "LEFT",
        })),
        LEFT,
      ])
    ),
    __, // 3
    JOIN,
    __, // 5
    or([rangeVar, rangeSubselect]),
    __,
    optional(or([sequence([AS, __, identifierIncludingKeyword]), identifier])),
    __, // 9
    ON,
    __,
    (ctx) => rawValue(ctx),
  ]),
  (v) => {
    return {
      // everything except larg
      value: {
        jointype:
          v[0]?.value === "LEFT"
            ? JoinType.JOIN_LEFT
            : v[0]?.value === "RIGHT"
            ? JoinType.JOIN_RIGHT
            : JoinType.JOIN_INNER,
        arg:
          "RangeVar" in v[4].value
            ? { RangeVar: v[4].value.RangeVar }
            : { RangeSubselect: v[4].value.RangeSubselect },
        quals: v[10].value,
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[4].codeComment,
        v[5],
        v[6]?.length === 3 ? v[6][1] : "",
        v[7],
        v[9],
        v[10].codeComment
      ),
    };
  }
);

function nestJoins(
  arg:
    | {
        RangeVar: RangeVar;
      }
    | {
        RangeSubselect: RangeSubselect;
      },
  joins: SomeJoin[]
): JoinExpr {
  const join = joins[joins.length - 1];

  return {
    jointype: join.jointype,
    larg:
      joins.length > 1 ? { JoinExpr: nestJoins(arg, joins.slice(0, -1)) } : arg,
    rarg: join.arg,
    quals: join.quals,
  };
}

export const joinExpr: Rule<{
  value: { JoinExpr: JoinExpr };
  codeComment: string;
}> = transform(
  maybeInParens(
    sequence([
      or([rangeVar, rangeSubselect]),
      __,
      someJoin,
      zeroToMany(sequence([__, someJoin])),
    ])
  ),
  (c) => {
    const v = c.value;
    const joins = [v[2].value, ...v[3].map((i) => i[1].value)];

    return {
      value: {
        JoinExpr: nestJoins(v[0].value, joins),
      },

      codeComment: combineComments(
        c.topCodeComment,
        v[0].codeComment,
        v[2].codeComment,
        ...v[3].map((i) => i[0]),
        c.bottomCodeComment
      ),
    };
  }
);
