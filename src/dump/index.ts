import { Stmt, CreateStmt } from "../types";
import parse from "../parse";
import formatCreateStmt from "../format/createStmt";

type Dump = {
  CreateStmt: CreateStmt[];
  index: string; // <-- useful when it fails
  error?: { message: string; sql: string };
};

export default function dump(input: string): string {
  const stmts = parse(input);

  const dump: Dump = {
    CreateStmt: [],
    index: "0",
  };

  for (const index in stmts) {
    dump.index = index;
    const stmt = { ...stmts[index].RawStmt.stmt };

    if ("CreateStmt" in stmt) {
      const name = stmt.CreateStmt.relation.RangeVar.relname;

      const existingCreateTable = dump.CreateStmt.some(
        (s) => s.relation.RangeVar.relname === name
      );

      if (existingCreateTable) {
        dump.error = { message: `Table "${name}" already exists`, sql: "" };
        break;
      }

      // Lets add the public schema if none exists
      if (!stmt.CreateStmt.relation.RangeVar.schemaname) {
        stmt.CreateStmt.relation.RangeVar.schemaname = "public";
      }

      dump.CreateStmt.push(stmt.CreateStmt);
    }
  }

  if (dump.error) {
    throw new Error(dump.error.message);
  }

  return (
    dump.CreateStmt.slice()
      // The dump is always in alphabetical order
      .sort((a, b) =>
        a.relation.RangeVar.relname > b.relation.RangeVar.relname ? 1 : -1
      )
      // Lets make it a string
      .map(formatCreateStmt)
      .join("\n")
  );
}
