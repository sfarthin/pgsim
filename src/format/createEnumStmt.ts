import { CreateEnumStmt } from "~/types";

export default function variableSetStmt(
  createEnumStmt: CreateEnumStmt
): string {
  // console.log(JSON.stringify(createEnumStmt, null, 2));
  return `
    CREATE TYPE ${createEnumStmt.typeName[0].String.str} AS ENUM (
      ${createEnumStmt.vals.map((s) => `'${s.String.str}'`).join(",\n")}
    );
  `;
}
