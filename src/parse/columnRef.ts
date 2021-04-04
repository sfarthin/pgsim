import { transform, Rule, tableIdentifier, or, STAR } from "./util";
import { ColumnRef } from "../types";

export const columnRef: Rule<ColumnRef> = or([
  transform(tableIdentifier, (value, ctx) => {
    if (value.length === 1) {
      return {
        location: ctx.pos,
        fields: [{ String: { str: value[0] } }],
      };
    } else if (value.length === 2) {
      return {
        location: ctx.pos,
        fields: [{ String: { str: value[0] } }, { String: { str: value[1] } }],
      };
    }

    throw new Error("Unexpected column ref");
  }),
  transform(STAR, (value, ctx) => {
    return {
      location: ctx.pos,
      fields: [{ A_Star: {} }],
    };
  }),
]);
