import { resolve } from "path";
import { writeFileSync, readdirSync, existsSync } from "fs";
import prettier from "prettier";
import warning from "./warning";
import { stmtTypes, mapStmtTypes } from "./constants";
import { camelCase } from "lodash";

const toDecoder = (n: string) => camelCase(`${n}Decoder`);

export default async function () {
  const typesIndexPath = resolve(__dirname, "../types/index.ts");

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

    export type StmtType = KeysOfUnion<Stmt["stmt"]>;

    `,
      { parser: "babel" }
    )
  );

  for (const stmtType of stmtTypes) {
    const stmtFilePath = resolve(
      __dirname,
      `../types/${camelCase(stmtType)}.ts`
    );
    if (!existsSync(stmtFilePath)) {
      writeFileSync(
        stmtFilePath,
        prettier.format(
          /* ts */ ` 
        import * as d from 'decoders';

        export const ${toDecoder(
          stmtType
        )} = d.fail('${stmtType} not implemented');
        export type ${stmtType} = d.DecoderType<typeof ${toDecoder(stmtType)}>;
      `,
          { parser: "babel" }
        )
      );
    }
  }
}
