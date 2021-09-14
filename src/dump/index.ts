// import { Stmt, CreateStmt } from "../types";
// import parse from "../parse";
// import format from "../format";
// import formatCreateStmt from "../format/createStmt";

// import alterTableStmt from "./alterTableStmt";
// import createStmt from "./createStmt";
// import { NEWLINE, textFormatter } from "../format/util";

// export default function dump(input: string | Stmt[]): string {
//   // Since we mutate the ast, make sure we clone a fresh version coming in.
//   const stmts =
//     typeof input === "string"
//       ? parse(input)
//       : JSON.parse(JSON.stringify(input));

//   const dump: {
//     CreateStmt: CreateStmt[];
//   } = {
//     CreateStmt: [],
//   };

//   for (const index in stmts) {
//     const stmt = stmts[index].stmt;

//     if ("CreateStmt" in stmt) {
//       createStmt(dump.CreateStmt, stmt.CreateStmt);
//     } else if ("AlterTableStmt" in stmt) {
//       alterTableStmt(dump.CreateStmt, stmt.AlterTableStmt);
//     }
//   }

//   return format(
//     [
//       ...dump.CreateStmt.slice()
//         // The dump is always in alphabetical order
//         .sort((a, b) => (a.relation.relname > b.relation.relname ? 1 : -1))
//         // Print create statement
//         .map((s) => textFormatter.concat(formatCreateStmt(s, textFormatter))),
//     ].join(NEWLINE)
//   );
// }
