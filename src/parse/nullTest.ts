import { rawValuePostfix } from "./rawExpr";
import {
  sequence,
  __,
  combineComments,
  NOT,
  Context,
  optional,
  NULL,
  IS,
} from "./util";

export const nullTestConnection = (ctx: Context) =>
  rawValuePostfix(sequence([__, IS, __, optional(NOT), __, NULL]), (c1, v) => {
    return {
      value: {
        NullTest: {
          arg: c1.value,
          nulltesttype: v[3] ? 1 : 0,
          location: v[1].start,
        },
      },
      codeComment: combineComments(c1.codeComment, v[0], v[2], v[4]),
    };
  })(ctx);
