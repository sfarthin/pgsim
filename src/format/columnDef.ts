import { ColumnDef } from "../types";

import toConstraints from "./constraint";
import { comment, identifier, _, Block } from "./util";
import typeName from "./typeName";

export default function toColumn(columnDef: ColumnDef): Block {
  if (!columnDef.colname) {
    throw new Error("Expected column name");
  }

  const constraints = columnDef.constraints?.map((c) => c.Constraint) ?? [];

  return [
    ...comment(columnDef.codeComment),
    [
      identifier(columnDef.colname),
      _,
      ...typeName(columnDef.typeName),
      ...toConstraints(constraints),
    ],
  ];
}
