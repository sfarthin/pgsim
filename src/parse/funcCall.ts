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
} from "./util";
import { FuncCall } from "~/types";
import { rawValue } from "./rawExpr";
import { rangeVar } from "./rangeVar";

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
    __,
    optional(
      or([
        transform(STAR, () => ({
          isStar: true,
          codeComment: "",
        })),
        (ctx) => rawValue(ctx),
      ])
    ), // 4
    zeroToMany(sequence([__, COMMA, __, (ctx) => rawValue(ctx)])), //5
    __,
    RPAREN,
  ]),
  (v, ctx) => {
    const agg_star = v[4] && "isStar" in v[4];
    const args = (v[4] && !("isStar" in v[4]) ? [v[4].value] : []).concat(
      v[5].length > 0 ? v[5].map((o) => o[3].value) : []
    );
    return {
      value: {
        FuncCall: {
          funcname: v[0],
          ...(agg_star ? { agg_star: true } : args.length > 0 ? { args } : {}),
          // func_variadic?: boolean; // select concat(variadic array [1,2,3])
          // agg_distinct?: boolean;
          // over?: unknown;
          location: ctx.pos,
        },
      },
      codeComment: combineComments(
        v[1],
        v[3],
        v[4]?.codeComment,
        ...v[5].map((l) => combineComments(l[0], l[2], l[3].codeComment)),
        v[6]
      ),
    };
  }
);

export const funcCall = or([extractFromfuncCall, normalfuncCall]);
