import { or, Rule, constant, transform } from "./util";
import { TypeCast } from "~/types";

const booleanLiteral = transform(
  or([constant("true"), constant("false")]),
  ({ value }, ctx) => {
    return {
      arg: {
        A_Const: {
          val: {
            String: { str: value.toLowerCase() === "true" ? "t" : "f" },
          },
          location: ctx.pos,
        },
      },
      typeName: {
        TypeName: {
          names: [
            { String: { str: "pg_catalog" } },
            { String: { str: "bool" } },
          ],
          typemod: -1,
          location: -1,
        },
      },
      location: -1,
    };
  }
);

export const typeCast: Rule<TypeCast> = booleanLiteral;
