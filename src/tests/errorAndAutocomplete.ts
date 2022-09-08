import yargs from "yargs/yargs";
import parse from "../parse";
import { join, basename } from "path";
import { lstatSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { wordsWithSpace as assertStr } from "assert-no-diff";

// See ansi-regex npm module
function getRemoveAnsiRegx({ onlyFirst = false } = {}) {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
  ].join("|");

  return new RegExp(pattern, onlyFirst ? undefined : "g");
}

const args = yargs(process.argv.slice(2))
  .options({
    write: { type: "boolean", default: false },
    file: { type: "string" },
  })
  .parseSync();

export default function errorAndAutocomplete(
  sql: string,
  filename: string
): void {
  let snapshotTxt = "";

  try {
    parse(sql, filename);
  } catch (e) {
    if (e instanceof Error) {
      snapshotTxt = e.message;
    }
  }

  if (snapshotTxt === "") {
    throw new Error(`Expected error with ${filename}`);
  }

  const filePath = join(
    __dirname,
    "../../fixtures/errorAndAutocomplete/__snapshots__",
    filename.replace(/\.sql/, "-snapshot.sql")
  );
  const body = snapshotTxt.replace(getRemoveAnsiRegx(), "");
  if (args.write) {
    writeFileSync(filePath, body);
  } else {
    assertStr(
      readFileSync(filePath).toString(),
      body,
      `${filename} does not match snapshot`
    );
  }
}

if (args.file) {
  const filepath = join(process.cwd(), args.file);

  let files;
  if (lstatSync(filepath).isDirectory()) {
    files = readdirSync(filepath)
      .filter((f) => f.match(/\.sql$/))
      .map((f) => join(process.cwd(), args.file ?? "", f));
  } else {
    files = [filepath];
  }

  for (const file of files) {
    errorAndAutocomplete(readFileSync(file).toString(), basename(file));
  }
} else {
  const files: string[] = readdirSync(
    join(__dirname, "../../fixtures/errorAndAutocomplete")
  ).reduce((acc: string[], file: string) => {
    if (!file.match(/\.sql$/)) {
      return acc;
    }
    return [
      ...acc,
      join(__dirname, "../../fixtures/errorAndAutocomplete", file),
    ];
  }, []);

  for (const file of files) {
    errorAndAutocomplete(readFileSync(file).toString(), basename(file));
  }
}
