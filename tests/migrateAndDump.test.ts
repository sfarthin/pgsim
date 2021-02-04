import { Stmt } from "../src/types";
import format from "../src/format";
import parse from "../src/parse";
import migrate from "../src/migrate";
import dump from "../src/dump";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import crypto from "crypto";
import assert from "assert";

/**
 * Lets
 */
function removeVariableSetStmt(stmts: Stmt[]) {
  return stmts.filter(
    (s) =>
      !("Comment" in s.RawStmt.stmt) &&
      !("VariableSetStmt" in s.RawStmt.stmt) &&
      !("SelectStmt" in s.RawStmt.stmt)
  );
}

const hash = (s: string) => crypto.createHash("md5").update(s).digest("hex");
const env = {
  PGPORT: process.env.PGPORT,
  PATH: process.env.PATH,
};
function nativeDump(fullPath: string, file: string, fullSql: string) {
  const databaseName = `test${file.replace(/[^a-z]/gi, "")}`;
  const cachePath = join(
    __dirname,
    "./cache",
    `databaseName-${hash(fullSql)}.sql`
  );

  if (existsSync(cachePath)) {
    return readFileSync(cachePath).toString();
  }

  execSync(`dropdb ${databaseName} --if-exists`, {
    stdio: "inherit",
    env,
  });
  execSync(`createdb ${databaseName}`, { stdio: "inherit", env });
  execSync(`psql --dbname ${databaseName} -f ${fullPath}`, {
    stdio: "inherit",
    env,
  });
  const dump = execSync(`pg_dump --schema-only --no-owner ${databaseName}`, {
    env,
  }).toString();
  execSync(`dropdb ${databaseName}`, { stdio: "inherit", env });

  writeFileSync(cachePath, dump);

  return dump;
}

const files: { [s: string]: { fullPath: string; sql: string } } = readdirSync(
  join(__dirname, "./migrateAndDump")
).reduce((acc, file) => {
  if (!file.match(/\.sql$/)) {
    return acc;
  }
  return {
    ...acc,
    [file]: {
      fullPath: join(__dirname, "./migrateAndDump", file),
      sql: readFileSync(join(__dirname, "./migrateAndDump", file)).toString(),
    },
  };
}, {});

describe("Migrate and Dump", () => {
  for (const file in files) {
    // if (file === "createSeqStmt.sql") {
    it(file, async () => {
      const { sql, fullPath } = files[file];
      const nDump = format(
        removeVariableSetStmt(parse(nativeDump(fullPath, file, sql)))
      );

      const myDump = dump(sql);

      assert.strictEqual(myDump, nDump);

      const ast = parse(sql);
      const firstPart = dump([ast[0]]);

      const migration = migrate(firstPart, myDump);

      // console.log(`${firstPart}\n${migration}`);

      assert.strictEqual(dump(`${firstPart}\n${migration}`), nDump);
    });
    // }
  }
});
