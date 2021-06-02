import { RangeVar } from "../types";
import {
  transform,
  identifier,
  Rule,
  sequence,
  optional,
  or,
  AS,
  __,
  combineComments,
  PERIOD,
} from "./util";

export const rangeVar: Rule<{
  value: { RangeVar: RangeVar };
  codeComment: string;
}> = transform(
  sequence([
    identifier,
    optional(sequence([PERIOD, identifier])),
    optional(
      or([sequence([__, AS, __, identifier]), sequence([__, identifier])])
    ),
  ]),
  (v, ctx) => ({
    value: {
      RangeVar: {
        ...(v[1] ? { relname: v[1][1], schemaname: v[0] } : { relname: v[0] }),
        inh: true,
        relpersistence: "p" as const,
        location: ctx.pos,
        ...(v[2]
          ? {
              alias: {
                Alias: { aliasname: v[2].length === 4 ? v[2][3] : v[2][1] },
              },
            }
          : {}),
      },
    },

    codeComment: combineComments(
      ...(v[2] && v[2].length === 4
        ? [v[2][0], v[2][2]]
        : v[2] && v[2].length === 2
        ? [v[2][0]]
        : [])
    ),
  })
);
