import { guard } from "decoders";
import { stmtDecoder, Stmt } from "~/types";
import { parse } from "./language";

export default function (sql: string): Stmt[] {
  const unsafeResult = parse(sql);

  return unsafeResult.map(guard(stmtDecoder));
}
