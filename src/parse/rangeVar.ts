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
} from "./util";

export const rangeVar: Rule<{
  value: { RangeVar: RangeVar };
  codeComment: string;
}> = transform(
  sequence([
    identifier,
    optional(
      or([sequence([__, AS, __, identifier]), sequence([__, identifier])])
    ),
  ]),
  (v, ctx) => ({
    value: {
      RangeVar: {
        relname: v[0],
        inh: true,
        relpersistence: "p" as const,
        location: ctx.pos,
        ...(v[1]
          ? {
              alias: {
                Alias: { aliasname: v[1].length === 4 ? v[1][3] : v[1][1] },
              },
            }
          : {}),
      },
    },

    codeComment: combineComments(
      ...(v[1] && v[1].length === 4
        ? [v[1][0], v[1][2]]
        : v[1] && v[1].length === 2
        ? [v[1][0]]
        : [])
    ),
  })
);
