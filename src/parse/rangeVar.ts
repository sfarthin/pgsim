import { RangeVar } from "~/types";
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
  identifierIncludingKeyword,
} from "./util";

export const rangeVar: Rule<{
  value: { RangeVar: RangeVar };
  codeComment: string;
}> = transform(
  sequence([
    sequence([identifier, optional(sequence([PERIOD, identifier]))]),
    // column [AS alias | alias]
    // identifier('foo') ... v[3].foo
    optional(
      or([
        sequence([__, AS, __, identifierIncludingKeyword]),
        sequence([__, identifier]),
      ])
    ),
  ]),
  (v, ctx) => {
    const codeComment = combineComments(
      ...(v[1] && v[1].length === 4
        ? [v[1][0], v[1][2]]
        : v[1] && v[1].length === 2
        ? [v[1][0]]
        : [])
    );

    return {
      value: {
        RangeVar: {
          ...(v[0][1]
            ? { relname: v[0][1][1], schemaname: v[0][0] }
            : { relname: v[0][0] }),
          inh: true,
          relpersistence: "p" as const,
          location: ctx.pos,
          ...(v[1]
            ? {
                alias: { aliasname: v[1].length === 4 ? v[1][3] : v[1][1] },
              }
            : {}),
        },
      },
      codeComment,
    };
  }
);
