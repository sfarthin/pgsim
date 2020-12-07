import { CreateEnumStmt } from "~/types";
import comment from "./comment";

export default function variableSetStmt(
  createEnumStmt: CreateEnumStmt
): string {
  // console.log(JSON.stringify(createEnumStmt, null, 2));
  return `${comment(createEnumStmt.comment)}CREATE TYPE ${
    createEnumStmt.typeName[0].String.str
  } AS ENUM (\n${createEnumStmt.vals
    .map((s) => `${comment(s.comment, 1)}\t'${s.String.str}'`)
    .join(",\n")}\n);\n`;
}
