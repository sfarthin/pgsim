import { resolve } from "path";
import { writeFileSync, readdirSync, existsSync } from "fs";
import prettier from "prettier";
import warning from "./warning";
import { stmtTypes, mapStmtTypes } from "./constants";
import { camelCase } from "lodash";

export default async function () {
  const parseStmtPath = resolve(__dirname, "../format/stmt.ts");
  const formatIndexPath = resolve(__dirname, "../format/index.ts");

  const files = readdirSync(resolve(__dirname, "../format/")).flatMap((f) =>
    f === "index.ts" ? [] : f.substring(0, f.length - 3)
  );

  const mapFiles = (mapFn: (n: string) => string) =>
    files.map(mapFn).join(`\n`);

  const importedFormatters = mapStmtTypes(
    (stmtName) =>
      `import ${camelCase(stmtName)} from "./${camelCase(stmtName)}";`
  );

  const exportedStmt = mapFiles((stmtName) => `export * from "./${stmtName}";`);

  const longConditional = stmtTypes
    .map(
      (stmtType) => /* ts */ `
    if ("${stmtType}" in s) {
      return ${camelCase(stmtType)}(s.${stmtType});
    }
  `
    )
    .join(` else `);

  writeFileSync(
    parseStmtPath,
    prettier.format(
      /* ts */ `

    ${warning}
    import { Stmt } from "~/types";
    import { Block } from "./util";
    ${importedFormatters}

    export default function stmt(stmt: Stmt): Block {
      const s = stmt.stmt;
    
      ${longConditional}
      
      throw new Error('Cannot format ' + Object.keys(s));
      
    }
    

    `,
      { parser: "babel" }
    )
  );

  writeFileSync(
    formatIndexPath,
    prettier.format(
      /* ts */ `

    ${warning}
    import format from "./format";
    export { toString } from "./print";
    export default format;
    ${exportedStmt}

    `,
      { parser: "babel" }
    )
  );

  for (const stmtType of stmtTypes) {
    const stmtFilePath = resolve(
      __dirname,
      `../format/${camelCase(stmtType)}.ts`
    );
    if (!existsSync(stmtFilePath)) {
      writeFileSync(
        stmtFilePath,
        prettier.format(
          /* ts */ `
        import { ${stmtType} } from "~/types";
        import { Block } from "./util";
        
        export default function (_c: ${stmtType}): Block {
          return [];
        }
      `,
          { parser: "babel" }
        )
      );
    }
  }
}
