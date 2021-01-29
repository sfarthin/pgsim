// import { Stmt } from "~/types";
// import { Field } from "./types";
// import { emptySchema, Schema } from "../toSchema";
// import { fromSelect } from "./selectStmt";

// export default function toResultType(
//   { RawStmt: { stmt } }: Stmt,
//   schema: Schema = emptySchema
// ): Field[] {
//   if ("SelectStmt" in stmt) {
//     return fromSelect(schema, stmt.SelectStmt);
//   } else {
//     throw new Error(`Todo ${Object.keys(stmt)[0]}`);
//   }
// }
