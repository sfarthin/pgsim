import {
  identifier,
  sequence,
  transform,
  Rule,
  oneToMany,
  combineComments,
  optional,
  // _,
  __,
} from "./util";
import { typeName } from "./typeName";
import { ColumnDef } from "~/types";
import { constraint } from "./constraint";

export const columnDef: Rule<ColumnDef> = transform(
  sequence([
    __,
    transform(identifier, (value, ctx) => ({ value, pos: ctx.pos })),
    __,
    typeName,
    __,
    optional(oneToMany(sequence([__, constraint, __]))),
  ]),
  (value) => {
    const listOfConstraints = value[5]?.map((e) => ({
      Constraint: e[1].value,
    }));
    return {
      colname: value[1].value,
      typeName: value[3].value,
      ...(listOfConstraints ? { constraints: listOfConstraints } : {}),
      is_local: true,
      location: value[1].pos,
      codeComment: combineComments(
        value[0],
        value[2],
        value[3].codeComment,
        value[4],
        ...(value[5]?.map((e) =>
          combineComments(e[0], e[1].codeComment, e[2])
        ) ?? [])
      ),
    };
  }
);
