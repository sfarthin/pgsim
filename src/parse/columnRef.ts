import { transform, Rule, tableIdentifier } from "./util";
import { ColumnRef } from "../types";

export const columnRef: Rule<ColumnRef> = transform(
  tableIdentifier,
  (value, ctx) => {
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
  }
);
