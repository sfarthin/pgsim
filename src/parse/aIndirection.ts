import { aConst } from "./aConst";
import { rawValuePostfix } from "./rawExpr";
import {
  sequence,
  __,
  combineComments,
  OPEN_BRACKET,
  CLOSE_BRACKET,
  Context,
} from "./util";

export const aIndirectionConnection = (ctx: Context) =>
  rawValuePostfix(
    sequence([OPEN_BRACKET, __, aConst, __, CLOSE_BRACKET]),
    (c1, v) => {
      return {
        codeComment: combineComments(
          c1.codeComment,
          v[1],
          v[2].codeComment,
          v[3]
        ),
        value: {
          A_Indirection: {
            arg: c1.value,
            indirection: [
              {
                A_Indices: {
                  uidx: v[2].value,
                },
              },
            ],
          },
        },
      };
    }
  )(ctx);
