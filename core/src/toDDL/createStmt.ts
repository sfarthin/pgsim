import { CreateStmt } from "../toParser";

export default function (createStmt: CreateStmt): string {
  const tableName = createStmt.relation.RangeVar.relname;
  return `
--
-- Name: ${tableName}; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."${tableName}" (
    "id" integer NOT NULL
);
  `.replace(/^\s+|\s+$/gm, "");
}
