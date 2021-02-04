import { CreateStmt } from "../types";
import dump from "../dump";
import parse from "../parse";
import createStmt from "./createStmt";

export default function migrate(
  from: string,
  to: string,
  opts?: { fromFile?: string; toFile?: string }
): string {
  const migration: string[] = [];

  const fromDump = parse(dump(from));
  const toDump = parse(dump(to));

  if (opts?.fromFile && opts?.toFile) {
    migration.push(`
    -- Migration from ${opts?.fromFile} -> ${opts?.toFile}
    `);
  }

  const fromCreateStmt = fromDump
    .map((s) =>
      "CreateStmt" in s.RawStmt.stmt ? s.RawStmt.stmt.CreateStmt : null
    )
    .filter(Boolean) as CreateStmt[];

  const toCreateStmt = toDump
    .map((s) =>
      "CreateStmt" in s.RawStmt.stmt ? s.RawStmt.stmt.CreateStmt : null
    )
    .filter(Boolean) as CreateStmt[];

  migration.push(createStmt(fromCreateStmt, toCreateStmt));

  if (migration.filter(Boolean).length <= 1) {
    return "";
  }

  return migration.filter(Boolean).join("\n");
}
