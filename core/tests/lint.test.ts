import {
  lintString,
  PGErrorCode,
  lintStream,
  LintOptions,
  toArray,
} from "../src";
import fixtures from "./fixtures";

function expectLint(str: string, options: LintOptions = {}) {
  return expect(
    toArray(lintString(str, options)).map(({ code, index }) => ({
      index,
      code,
    }))
  );
}

describe("lintQuery", () => {
  it("can find unknown types in schema", () => {
    expectLint(`
      CREATE TABLE users (
          id BIGSERIAL PRIMARY KEY
      );
      ALTER TABLE users ADD COLUMN email FOO(250);
      SELECT id, foo FROM users
    `).toEqual([{ index: 2, code: PGErrorCode.NOT_UNDERSTOOD }]);
  });
});

describe("lint fixtures", () => {
  it.only("can lint regress fixtures", () => {
    // TODO allow processing of SQL together, with now schema.
    const result = toArray(lintStream(fixtures()));
    console.log(result.map((r) => r.message).join("\n"));
  });
});

// Use sql from https://github.com/postgres/postgres/tree/master/src/test/regress/sql
// and run linter on all sql and use snapshot tests to gauge changes.
