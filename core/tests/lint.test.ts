import { lintQuery } from "../src/lint";
import toSchema from "../src/toSchema";
import { PGErrorCode } from "../src/errors";
import fixtures from "./fixtures";

const toCode = ({ error }: { error: any }) => error;

describe("lintQuery", () => {
  it("can find unknown types in schema", () => {
    const errors = lintQuery(
      toSchema(`
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY
        );
        ALTER TABLE users ADD COLUMN email FOO(250);
        `),
      "SELECT id, foo FROM users"
    ).map(toCode);

    expect(errors).toEqual([PGErrorCode.NOT_UNDERSTOOD]);
  });
  it("can find unknown types in schema", () => {
    const errors = lintQuery(
      toSchema(`
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY
        );
        `),
      `
      CREATE TABLE accounts (
        id BIGSERIAL PRIMARY KEY
      );
      `
    ).map(toCode);

    expect(errors).toEqual([PGErrorCode.NO_ALTER_TABLE]);
  });
});

describe("lint fixtures", () => {
  it("can lint regress fixtures", () => {
    // TODO allow processing of SQL together, with now schema.
    const iter = fixtures();
    let schema;
    var curr = iter.next();
    while (!curr.done) {
      const { sql, name } = curr.value;

      // Update schema
      schema = toSchema(sql, schema);

      curr = iter.next();
    }
  });
});

// Use sql from https://github.com/postgres/postgres/tree/master/src/test/regress/sql
// and run linter on all sql and use snapshot tests to gauge changes.
