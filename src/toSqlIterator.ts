import { readFileSync } from "fs";

type SqlIterator = Iterator<string, void>;

// TODO read parts of a file at a time and parse with pegjs
export function* fromFilesToSqlIterator(files: string[]): SqlIterator {
  for (const file of files) {
    yield readFileSync(file).toString();
  }
}

export function* fromStringToSqlIterator(str: string): SqlIterator {
  yield str;
}
