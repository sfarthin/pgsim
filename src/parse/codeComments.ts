import {
  sqlStyleComment,
  cStyleComment,
  transform,
  or,
  zeroToMany,
  endOfInput,
  notConstant,
  sequence,
  constant,
  Rule,
  combineComments,
} from "./util";

/**
 * This rule takes an entire SQL blob and pulls out just the comments.
 */
export const codeComments: Rule<string> = transform(
  sequence([
    zeroToMany(
      or([
        sqlStyleComment,
        cStyleComment,
        transform(notConstant("'"), () => ""),
        transform(
          sequence([
            constant("'"),
            zeroToMany(notConstant("'")),
            constant("'"),
          ]),
          () => ""
        ),
      ])
    ),
    endOfInput,
  ]),
  (v) => combineComments(...v[0])
);
