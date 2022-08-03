import { resolve } from "path";
import { writeFileSync, readdirSync } from "fs";
import prettier from "prettier";
import warning from "./warning";
import { stmtTypes } from "./constants";
import { camelCase } from "lodash";

export default async function writeTypesIndex() {
  const typesIndexPath = resolve(__dirname, "../types/index.ts");

  const toDecoder = (n: string) => camelCase(`${n}Decoder`);
  const mapStmtTypes = (mapFn: (n: string) => string) =>
    stmtTypes.map(mapFn).join(`\n`);

  const files = readdirSync(resolve(__dirname, "../types/")).flatMap((f) =>
    f === "index.ts" ? [] : f.substring(0, f.length - 3)
  );

  const mapFiles = (mapFn: (n: string) => string) =>
    files.map(mapFn).join(`\n`);

  const importedTypesAndDecoders = mapStmtTypes(
    (stmtName) =>
      `import { ${stmtName}, ${toDecoder(stmtName)} } from "./${camelCase(
        stmtName
      )}";`
  );

  const exportedStmt = mapFiles((stmtName) => `export * from "./${stmtName}";`);

  const typeStmt = stmtTypes
    .map((typeName) => `{ ${typeName}: ${typeName} }`)
    .join(` | `);

  writeFileSync(
    typesIndexPath,
    prettier.format(
      /* ts */ `

    ${warning}
    import * as d from "decoders";
    import dispatch from "./dispatch";
    import { Block } from "~/format/util";
    import { KeysOfUnion } from "./util";

    ${importedTypesAndDecoders}
    ${exportedStmt}

    export type Stmt = {
        stmt_len?: number; // <-- This simulates the same fields we have on the native parser
        stmt_location?: number; // <-- This simulates the same fields we have on the native parser
        tokens?: Block; // <-- This is only supported by our parser
        stmt: ${typeStmt}
    }

    export const stmtDecoder: d.Decoder<Stmt> = d.exact({
        stmt_len: d.optional(d.number),
        stmt_location: d.optional(d.number),
        stmt: dispatch({
            ${mapStmtTypes((n) => `${n}: ${toDecoder(n)},`)}
        })
    });

    export type StatementType = KeysOfUnion<Stmt["stmt"]>;

    `,
      { parser: "babel" }
    )
  );
}
