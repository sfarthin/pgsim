import { resolve } from "path";
import { writeFileSync, readdirSync, existsSync } from "fs";
import prettier from "prettier";
import warning from "./warning";
import { stmtTypes, mapStmtTypes } from "./constants";
import { camelCase } from "lodash";

function mapStmtChunks(fn: (i: string[]) => string) {
  const chunkSize = 10;

  const chunks = [];

  for (let i = 0; i < stmtTypes.length; i += chunkSize) {
    chunks.push(stmtTypes.slice(i, i + chunkSize));
    // do whatever
  }

  return chunks.map((chunk) => fn(chunk)).join("\n");
}

export default async function () {
  const parseStmtPath = resolve(__dirname, "../parse/stmt.ts");
  const parseIndexPath = resolve(__dirname, "../parse/index.ts");

  const files = readdirSync(resolve(__dirname, "../parse/")).flatMap((f) =>
    f === "index.ts" ? [] : f.substring(0, f.length - 3)
  );

  const mapFiles = (mapFn: (n: string) => string) =>
    files.map(mapFn).join(`\n`);

  const importedParsers = mapStmtTypes(
    (stmtName) =>
      `import { ${camelCase(stmtName)} } from "./${camelCase(stmtName)}";`
  );

  const exportedStmt = mapFiles((stmtName) => `export * from "./${stmtName}";`);

  writeFileSync(
    parseStmtPath,
    prettier.format(
      /* ts */ `

    ${warning}
    import { or, addStmtType } from "./util";
    ${importedParsers}

    export const stmt = or([
      ${mapStmtChunks(
        (chunk) => /* ts */ `or([
          ${chunk.map((f) => `addStmtType('${f}', ${camelCase(f)})`).join(",")}
        ]),`
      )}
    ]);

    `,
      { parser: "babel" }
    )
  );

  writeFileSync(
    parseIndexPath,
    prettier.format(
      /* ts */ `

    ${warning}
    import { parse } from "./stmts";
    export default parse;
    ${exportedStmt}

    `,
      { parser: "babel" }
    )
  );

  for (const stmtType of stmtTypes) {
    const stmtFilePath = resolve(
      __dirname,
      `../parse/${camelCase(stmtType)}.ts`
    );
    if (!existsSync(stmtFilePath)) {
      writeFileSync(
        stmtFilePath,
        prettier.format(
          /* ts */ `
        import { ${stmtType} } from "~/types";
        import { Rule, EOS, fail } from "./util";

        export const ${camelCase(stmtType)}:Rule<{
          value: { ${stmtType}: ${stmtType} };
          eos: EOS;
        }> = fail;
      `,
          { parser: "babel" }
        )
      );
    }
  }
}
