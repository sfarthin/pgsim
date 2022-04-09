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
  fromBufferToCodeBlock,
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
        fromBufferToCodeBlock(
          transform(notConstant("'"), () => ""),
          (text) => [[{ type: "unknown", text }]]
        ),
        fromBufferToCodeBlock(
          transform(
            sequence([
              constant("'"),
              zeroToMany(notConstant("'")),
              constant("'"),
            ]),
            () => ""
          ),
          (text) => [[{ type: "unknown", text }]]
        ),
      ])
    ),
    endOfInput,
  ]),
  (v) => combineComments(...v[0])
);
