import { transform, Rule, tableIdentifier, or, STAR } from "./util";
import { ColumnRef } from "../types";

export const columnRef: Rule<{
  value: { ColumnRef: ColumnRef };
  codeComment: string;
}> = or([
  transform(tableIdentifier, (value, ctx) => {
    if (value.length === 1) {
      return {
        value: {
          ColumnRef: {
            location: ctx.pos,
            fields: [{ String: { str: value[0] } }],
          },
        },
        codeComment: "",
      };
    } else if (value.length === 2) {
      return {
        value: {
          ColumnRef: {
            location: ctx.pos,
            fields: [
              { String: { str: value[0] } },
              { String: { str: value[1] } },
            ],
          },
        },
        codeComment: "",
      };
    }

    throw new Error("Unexpected column ref");
  }),
  transform(STAR, (value, ctx) => {
    return {
      value: {
        ColumnRef: {
          location: ctx.pos,
          fields: [{ A_Star: {} }],
        },
      },
      codeComment: "",
    };
  }),
]);
