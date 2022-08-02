import { or } from "./util";
import { variableSetStmt } from "./variableSetStmt";
import { createEnumStmt } from "./createEnumStmt";
import { createSeqStmt } from "./createSeqStmt";
import { alterSeqStmt } from "./alterSeqStmt";
import { createStmt } from "./createStmt";
import { dropStmt } from "./dropStmt";
import { alterEnumStmt } from "./alterEnumStmt";
import { alterOwnerStmt } from "./alterOwnerStmt";
import { indexStmt } from "./indexStmt";
import { alterTableStmt } from "./alterTableStmt";
import { selectStmt } from "./selectStmt";
import { viewStmt } from "./viewStmt";
import { renameStmt } from "./renameStmt";
import { updateStmt } from "./updateStmt";
import { transactionStmt } from "./transactionStmt";
import { alterDatabaseSetStmt } from "./alterDatabaseSetStmt";
import { alterDatabaseStmt } from "./alterDatabaseStmt";
import { commentStatement } from "./commentStmt";

export const stmt = or([
  or([
    variableSetStmt,
    createEnumStmt,
    createSeqStmt,
    alterSeqStmt,
    createStmt,
    dropStmt,
    alterEnumStmt,
    alterOwnerStmt,
    indexStmt,
    alterTableStmt,
  ]),
  selectStmt,
  viewStmt,
  renameStmt,
  updateStmt,
  transactionStmt,
  alterDatabaseSetStmt,
  alterDatabaseStmt,

  // Standalone comments
  commentStatement,
]);
