import { Rule, transform, sequence, __, zeroToMany, COMMA, or } from "./util";
import { FromClause } from "~/types";
import { rangeVar } from "./rangeVar";
import { joinExpr } from "./joinExpr";
import { rangeSubselect } from "./rangeSubselect";

export const fromClause: Rule<{ value: FromClause[]; codeComments: string[] }> =
  transform(
    sequence([
      or([joinExpr, rangeVar, rangeSubselect]),
      zeroToMany(
        sequence([COMMA, __, or([joinExpr, rangeVar, rangeSubselect])])
      ),
    ]),
    (v) => {
      return {
        value: [v[0].value, ...v[1].map((n) => n[2].value)],
        codeComments: [
          v[0].codeComment,
          ...v[1].flatMap((n) => [n[1], n[2].codeComment]),
        ],
      };
    }
  );
