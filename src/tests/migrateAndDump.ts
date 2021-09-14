import { Stmt } from "../types";
import format from "../format";
import parse from "../parse";
import migrate from "../migrate";
import dump from "../dump";
import {
  readFileSync,
  readdirSync,
  existsSync,
  writeFileSync,
  lstatSync,
} from "fs";
import { join, basename } from "path";
import { execSync } from "child_process";
import crypto from "crypto";
import assert from "assert";

/**
 * Lets
 */
function removeVariableSetStmt(stmts: Stmt[]) {
  return stmts.filter(
    (s) =>
      !("Comment" in s.stmt) &&
      !("VariableSetStmt" in s.stmt) &&
      !("SelectStmt" in s.stmt)
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
    "../../cache",
    `${databaseName}-${hash(fullSql)}.sql`
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

function migrateAndDump({
  fullPath,
  sql,
}: {
  fullPath: string;
  sql: string;
}): string {
  const nDump = format(
    removeVariableSetStmt(parse(nativeDump(fullPath, basename(fullPath), sql))),
    {
      sql,
      filename: basename(fullPath),
    }
  );

  const myDump = dump(sql);

  assert.strictEqual(myDump, nDump, `\u001b[41;1mDump\u001b[0m Error`);

  const ast = parse(sql);

  let txt = "";
  for (let i = 0; i < ast.length; i++) {
    const firstPart = dump(ast.slice(0, i));

    const migration = migrate(firstPart, myDump);

    assert.strictEqual(
      dump(`${firstPart}\n${migration}`),
      nDump,
      `\u001b[41;1mMigration Failed:\u001b[0m\n\n---------\nInitial:\n---------\n${firstPart}\n\n---------\nMigration:\n---------\n\u001b[45;1m${
        migration ? migration : "No migrations!"
      }\u001b[0m\n\n---------\nResult:\n---------\n${myDump}\n---------`
    );

    txt += `${"\n"}--- ${i + 1}\n`;
    txt += `${firstPart}\n${migration}`;
  }

  return txt;
}

if (process.argv[2]) {
  const filepath = join(process.cwd(), process.argv[2]);

  let files;
  if (lstatSync(filepath).isDirectory()) {
    files = readdirSync(filepath)
      .filter((f) => f.match(/\.sql$/))
      .map((f) => join(process.cwd(), process.argv[2], f));
  } else {
    files = [filepath];
  }

  for (const file of files) {
    migrateAndDump({ sql: readFileSync(file).toString(), fullPath: file });
  }
} else {
  const files: { [s: string]: { fullPath: string; sql: string } } = readdirSync(
    join(__dirname, "../../fixtures/migrateAndDump")
  ).reduce((acc, file) => {
    if (!file.match(/\.sql$/)) {
      return acc;
    }
    return {
      ...acc,
      [file]: {
        fullPath: join(__dirname, "../../fixtures/migrateAndDump", file),
        sql: readFileSync(
          join(__dirname, "../../fixtures/migrateAndDump", file)
        ).toString(),
      },
    };
  }, {});

  for (const file in files) {
    const { sql, fullPath } = files[file];
    const txt = migrateAndDump({ fullPath, sql });

    writeFileSync(
      join(
        __dirname,
        "../../fixtures/migrateAndDump/__snapshots__",
        file.replace(/\.sql/, "-snapshot.sql")
      ),
      txt
    );
  }
}
