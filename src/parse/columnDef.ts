import { identifier, phrase, transform, Rule } from "./util";
import { typeName } from "./typeName";
import { ColumnDef } from "~/types";
// ColumnDef = colName:Identifier c:COMMENTS typeName:TypeName c2:COMMENTS constraints:ConstraintList? {
//     return {
//         ColumnDef: {
//             colname: colName.value,
//             typeName: { TypeName: typeName.value },
//             ...(constraints && constraints.value ? { constraints: constraints.value } : {}),
//             is_local: true,
//             // collClause?: unknown;
//             location: location(),
//             comment: combineComments(colName.comment, c, c2, typeName.comment, constraints ? constraints.comment : '')
//         }
//     }
// }

export const columnDef: Rule<ColumnDef> = transform(
  phrase([identifier, typeName /* , constraints */]),
  ({ value, comment }, ctx) => {
    return {
      colname: value[0],
      typeName: { TypeName: value[1].value },
      //   ...(constraints && constraints.value ? { constraints: constraints.value } : {}),
      is_local: true,
      location: ctx.pos,
      comment,
    };
  }
);
