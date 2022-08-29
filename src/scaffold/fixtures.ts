import { resolve } from "path";
import { writeFileSync, readdirSync } from "fs";
import { stmtTypes } from "~/constants";
import { camelCase } from "lodash";

export default async function () {
  const files = readdirSync(
    resolve(__dirname, "../../fixtures/parseAndFormat/")
  ).flatMap((f) => (f.match(/\.sql$/) ? [f.substring(0, f.length - 3)] : []));

  let num = files.reduce((a, b) => {
    const num = Number(b.split("-")[0]);
    return num > a ? num : a;
  }, 0);

  const currentStmtFixtures = files.reduce((ls, f) => {
    const stmtName = f.split("-")[1].split(".")[0];

    if (!ls.includes(stmtName)) {
      return ls.concat(stmtName);
    }

    return ls;
  }, [] as string[]);

  const missingFixtureFiles = stmtTypes.filter((t) => {
    return !currentStmtFixtures.includes(camelCase(t));
  });

  for (const stmtType of missingFixtureFiles) {
    const stmtFilePath = resolve(
      __dirname,
      `../../fixtures/parseAndFormat/${++num}-${camelCase(stmtType)}.sql`
    );
    writeFileSync(
      stmtFilePath,

      /* sql */ `
-- TODO, add ${stmtType} fixtures
        `
    );
  }
}
