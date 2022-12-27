import {
  Rule,
  identifier,
  zeroToMany,
  RPAREN,
  LPAREN,
  sequence,
  transform,
  COMMA,
  __,
  optional,
  combineComments,
  or,
  keyword,
  STAR,
  EXTRACT,
  FROM,
  PERIOD,
  DISTINCT,
  ORDER,
} from "./util";
import { FuncCall } from "~/types";
import { rawValue } from "./rawExpr";
import { sortBy } from "./sortBy";

const timePeriods = [
  "CENTURY", // The century	The number of centuries
  "DAY", // The day of the month (1-31)	The number of days
  "DECADE", // The decade that is the year divided by 10	Sames as TIMESTAMP
  "DOW", // The day of week Sunday (0) to Saturday (6)	N/A
  "DOY", // The day of year that ranges from 1 to 366	N/A
  "EPOCH", // The number of seconds since 1970-01-01 00:00:00 UTC	The total number of seconds in the interval
  "HOUR", // The hour (0-23)	The number of hours
  "ISODOW", // Day of week based on ISO 8601 Monday (1) to Sunday (7)	N/A
  "ISOYEAR", // ISO 8601 week number of year	N/A
  "MICROSECONDS", // The seconds field, including fractional parts, multiplied by 1000000	Sames as TIMESTAMP
  "MILLENNIUM", // The millennium	The number of millennium
  "MILLISECONDS", // The seconds field, including fractional parts, multiplied by 1000	Sames as TIMESTAMP
  "MINUTE", // The minute (0-59)	The number of minutes
  "MONTH", // Month, 1-12	The number of months, modulo (0-11)
  "QUARTER", // Quarter of the year	The number of quarters
  "SECOND", // The second	The number of seconds
  "TIMEZONE", // The timezone offset from UTC, measured in seconds	N/A
  "TIMEZONE_HOUR", // The hour component of the time zone offset	N/A
  "TIMEZONE_MINUTE", // The minute component of the time zone offset	N/A
  "WEEK", // The number of the ISO 8601 week-numbering week of the year	N/A
  "YEAR", //The year	Sames as TIMESTAMP
] as const;

// extract(... from ...)
const extractFromfuncCall: Rule<{
  value: { FuncCall: FuncCall };
  codeComment: string;
}> = transform(
  sequence([
    EXTRACT,
    __,
    LPAREN,
    __,
    // @ts-expect-error -- dunno
    or(timePeriods.map((v) => keyword(v.toLowerCase() as any))),
    __,
    FROM,
    __,
    (ctx) => rawValue(ctx),
    __,
    RPAREN,
  ]),
  (v, ctx) => {
    return {
      value: {
        FuncCall: {
          funcname: [
            {
              String: {
                str: "pg_catalog",
              },
            },
            {
              String: {
                str: "date_part",
              },
            },
          ],
          args: [
            {
              A_Const: {
                val: {
                  String: {
                    str: v[4].value,
                  },
                },
                location: v[4].start,
              },
            },
            v[8].value,
          ],
          location: ctx.pos,
        },
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[5],
        v[7],
        v[8].codeComment,
        v[9]
      ),
    };
  }
);

const funcName = transform(
  sequence([identifier, optional(sequence([PERIOD, identifier]))]),
  (v) => {
    if (v[1]?.[1]) {
      return [{ String: { str: v[0] } }, { String: { str: v[1]?.[1] } }];
    } else {
      return [{ String: { str: v[0] } }];
    }
  }
);

// THis should include equestions and type casts.
const normalfuncCall: Rule<{
  value: { FuncCall: FuncCall };
  codeComment: string;
}> = transform(
  sequence([
    funcName,
    __,
    LPAREN,
    optional(sequence([__, DISTINCT])),
    __,
    optional(
      or([
        transform(STAR, () => ({
          isStar: true,
          codeComment: "",
        })),
        (ctx) => rawValue(ctx),
      ])
    ), // 5
    zeroToMany(sequence([__, COMMA, __, (ctx) => rawValue(ctx)])), // 6
    __,
    optional(sortBy),
    __,
    RPAREN,
  ]),
  (v, ctx) => {
    const agg_star = v[5] && "isStar" in v[5];
    const args =
      v[5] && !("isStar" in v[5])
        ? [v[5].value].concat(
            v[6].length > 0 ? v[6].map((o) => o[3].value) : []
          )
        : [];
    const sortBy = v[8];

    return {
      value: {
        FuncCall: {
          funcname: v[0],
          ...(agg_star ? { agg_star: true } : args.length > 0 ? { args } : {}),
          // func_variadic?: boolean; // select concat(variadic array [1,2,3])
          ...(v[3] !== null ? { agg_distinct: true } : {}),
          ...(sortBy != null ? { agg_order: sortBy } : {}),
          // over?: unknown;
          location: ctx.pos,
        },
      },
      codeComment: combineComments(
        v[1],
        v[4]?.[0],
        v[4],
        v[5]?.codeComment,
        ...v[6].map((l) => combineComments(l[0], l[2], l[3].codeComment)),
        v[7],
        ...(v[8]
          ? v[8]?.flatMap((i) =>
              i.SortBy.codeComment ? [i.SortBy.codeComment] : []
            )
          : []),
        v[9]
      ),
    };
  }
);

const trimFuncCall: Rule<{
  value: { FuncCall: FuncCall };
  codeComment: string;
}> = transform(
  sequence([
    keyword("trim" as any),
    __,
    LPAREN,
    __,
    or([
      keyword("both" as any),
      keyword("leading" as any),
      keyword("trailing" as any),
    ]),
    __,
    keyword("FROM"),
    __,
    (ctx) => rawValue(ctx),
    __,
    RPAREN,
  ]),
  (v, ctx) => {
    return {
      value: {
        FuncCall: {
          funcname: [
            {
              String: {
                str: "pg_catalog",
              },
            },
            {
              String: {
                str:
                  v[4].value === "both"
                    ? "btrim"
                    : v[4].value === "leading"
                    ? "ltrim"
                    : "rtrim",
              },
            },
          ],
          args: [v[8].value],
          location: v[0].start,
        },
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[5],
        v[7],
        v[8].codeComment,
        v[9]
      ),
    };
  }
);

export const funcCall = or([extractFromfuncCall, normalfuncCall, trimFuncCall]);
