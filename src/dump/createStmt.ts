// import { CreateStmt } from "~/types";

// export default function createStmt(d: CreateStmt[], c: CreateStmt): void {
//   const name = c.relation.relname;

//   const existingCreateTable = d.some((s) => s.relation.relname === name);

//   if (existingCreateTable) {
//     throw new Error(`Table "${name}" already exists`);
//   }

//   if (!c.relation.schemaname) {
//     c.relation.schemaname = "public";
//   }

//   d.push(c);
// }
