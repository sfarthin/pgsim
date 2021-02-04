import { CreateStmt } from "../types";

export default function createStmt(d: CreateStmt[], c: CreateStmt): void {
  const name = c.relation.RangeVar.relname;

  const existingCreateTable = d.some(
    (s) => s.relation.RangeVar.relname === name
  );

  if (existingCreateTable) {
    throw new Error(`Table "${name}" already exists`);
  }

  if (!c.relation.RangeVar.schemaname) {
    c.relation.RangeVar.schemaname = "public";
  }

  d.push(c);
}
