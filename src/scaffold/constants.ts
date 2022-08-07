import { stmtTypes } from "~/constants";

export const mapStmtTypes = (mapFn: (n: string) => string) =>
  stmtTypes.map(mapFn).join(`\n`);
