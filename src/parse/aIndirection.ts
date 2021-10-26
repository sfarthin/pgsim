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
    sequence([__, OPEN_BRACKET, __, aConst, __, CLOSE_BRACKET, __]),
    (c1, v) => {
      return {
        codeComment: combineComments(
          v[0],
          c1.codeComment,
          v[2],
          v[3].codeComment,
          v[4],
          v[6]
        ),
        value: {
          A_Indirection: {
            arg: c1.value,
            indirection: [
              {
                A_Indices: {
                  uidx: v[3].value,
                },
              },
            ],
          },
        },
      };
    }
  )(ctx);
