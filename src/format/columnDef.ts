import { ColumnDef } from "~/types";

import toConstraints from "./constraint";
import { comment, identifier, _, Block, addToFirstLine } from "./util";
import typeName from "./typeName";

export default function toColumn(columnDef: ColumnDef): Block {
  if (!columnDef.colname) {
    throw new Error("Expected column name");
  }

  const constraints = toConstraints(
    columnDef.constraints?.map((c) => c.Constraint) ?? []
  );

  return [
    ...comment(columnDef.codeComment),
    ...(constraints.length
      ? addToFirstLine(
          [
            identifier(columnDef.colname),
            _,
            ...typeName(columnDef.typeName),
            _,
          ],
          constraints
        )
      : [[identifier(columnDef.colname), _, ...typeName(columnDef.typeName)]]),
  ];
}
