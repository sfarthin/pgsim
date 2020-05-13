import { lintString } from "../src";
import { LintOptions } from "../src/toLinter";
import { PGErrorCode } from "../src/errors";

function expectLint(str: string, options: LintOptions = {}) {
  return expect(
    lintString(str, options).map(({ code, index }) => ({
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
  it("can find unknown types in schema", () => {
    expectLint(`
      CREATE TABLE users (
        id BIGSERIAL PRIMARY KEY
      );
    `).toEqual([{ index: 0, code: PGErrorCode.INVALID }]);
  });
});

// describe("lint fixtures", () => {
//   it("can lint regress fixtures", () => {
//     // TODO allow processing of SQL together, with now schema.
//     const iter = fixtures();
//     let schema;
//     var curr = iter.next();
//     while (!curr.done) {
//       const { sql, name } = curr.value;

//       // Update schema
//       schema = toSchema(sql, schema);

//       curr = iter.next();
//     }
//   });
// });

// Use sql from https://github.com/postgres/postgres/tree/master/src/test/regress/sql
// and run linter on all sql and use snapshot tests to gauge changes.
