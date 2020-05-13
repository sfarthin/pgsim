import { readFileSync } from "fs";

type SqlIterator = Iterator<string, void>;

// TODO read parts of a file at a time and parse with pegjs
export function* fromFiles(files: string[]): SqlIterator {
  for (const file of files) {
    yield readFileSync(file).toString();
  }
}

export function* fromString(str: string): SqlIterator {
  yield str;
}

export function* fromStandardInput() {
  // TODO
}
