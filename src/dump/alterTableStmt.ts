// import { combineComments } from "../parse/util";
// import {
//   AlterTableCmdSubType,
//   CreateStmt,
//   AlterTableStmt,
//   ColumnDef,
//   ConType,
//   DefaultConstraint,
// } from "../types";

// export default function alterTableStmt(
//   d: CreateStmt[],
//   c: AlterTableStmt
// ): void {
//   const cmds = c.cmds;
//   const tablename = c.relation.relname;
//   const table = d.find((ct) => ct.relation.relname === tablename);

//   if (!table) {
//     throw new Error(`${tablename} does not exist`);
//   }

//   for (const cmd of cmds) {
//     /**
//      * Drop
//      */
//     if (cmd.AlterTableCmd.subtype === AlterTableCmdSubType.DROP) {
//       const colname = cmd.AlterTableCmd.name;
//       table.tableElts = table.tableElts?.filter(
//         (tc) => !("ColumnDef" in tc) || tc.ColumnDef?.colname !== colname
//       );
//       /**
//        * ADD_COLUMN
//        */
//     } else if (cmd.AlterTableCmd.subtype === AlterTableCmdSubType.ADD_COLUMN) {
//       cmd.AlterTableCmd.def.ColumnDef.codeComment = combineComments(
//         cmd.AlterTableCmd.def.ColumnDef.codeComment,
//         cmd.AlterTableCmd.codeComment
//       );
//       table.tableElts?.push(cmd.AlterTableCmd.def);
//       /**
//        * SET_DEFAULT
//        */
//     } else if (cmd.AlterTableCmd.subtype === AlterTableCmdSubType.SET_DEFAULT) {
//       const colname = cmd.AlterTableCmd.name;
//       const columnDef = table.tableElts?.find(
//         (t) => "ColumnDef" in t && t.ColumnDef?.colname === colname
//       ) as { ColumnDef: ColumnDef } | undefined;

//       if (!columnDef) {
//         throw new Error(`Column Does not exist: ${colname}`);
//       }

//       const exisitingConstraint = columnDef.ColumnDef.constraints?.find(
//         (c) => c.Constraint.contype === ConType.DEFAULT
//       ) as { Constraint: DefaultConstraint } | undefined;

//       if (cmd.AlterTableCmd.def) {
//         if (exisitingConstraint) {
//           exisitingConstraint.Constraint.raw_expr = cmd.AlterTableCmd.def;
//         } else {
//           columnDef.ColumnDef.constraints = [
//             {
//               Constraint: {
//                 contype: ConType.DEFAULT,
//                 location: 0,
//                 raw_expr: cmd.AlterTableCmd.def,
//               },
//             },
//           ];

//           // console.log(colname, JSON.stringify(columnDef.ColumnDef.constraints));
//         }
//       }
//     }
//   }
// }
