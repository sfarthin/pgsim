import toResultType, { fromSelect } from "../src/toResultType";
import toSchema from "../src/toSchema";
import { parseSelect } from "../src/parse";

const expectSelectType = (schema: string, selectQuery: string) =>
  expect(fromSelect(toSchema(schema), parseSelect(selectQuery)));

describe("toResultType", () => {
  it("Simple string select", () => {
    expectSelectType("", `SELECT 'foo'`).toEqual([
      { isNullable: false, name: null, type: "varchar" },
    ]);
  });
  it("Simple integer select", () => {
    expectSelectType("", `SELECT 4`).toEqual([
      { isNullable: false, name: null, type: "integer" },
    ]);
  });
  it("Simple float select", () => {
    expectSelectType("", `SELECT 4.4`).toEqual([
      { isNullable: false, name: null, type: "real" },
    ]);
  });

  it("Simple named fields", () => {
    expectSelectType("", `SELECT 4 as foo, 'foo' as bar`).toEqual([
      { isNullable: false, name: "foo", type: "integer" },
      { isNullable: false, name: "bar", type: "varchar" },
    ]);
  });

  // TODO star select, SELECT * FROM users
  it("Multiple tables", () => {
    expectSelectType(
      `
          CREATE TABLE users (
              id BIGSERIAL PRIMARY KEY
          );
          CREATE TABLE locations (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              state VARCHAR(250) NOT NULL,
              country VARCHAR(250) NOT NULL
          );
      `,
      `SELECT users.id, state FROM users, locations WHERE location.user_id = users.id`
    ).toEqual([
      { isNullable: true, name: "id", type: "bigserial" },
      { isNullable: false, name: "state", type: "varchar" },
    ]);
  });
  it("LEFT JOIN", () => {
    expectSelectType(
      `
          CREATE TABLE users (
              id BIGSERIAL PRIMARY KEY
          );
          CREATE TABLE locations (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              state VARCHAR(250) NOT NULL,
              country VARCHAR(250) NOT NULL
          );
      `,
      `SELECT users.id, state FROM users LEFT JOIN locations ON (locations.user_id = users.id)`
    ).toEqual([
      { isNullable: true, name: "id", type: "bigserial" },
      { isNullable: false, name: "state", type: "varchar" },
    ]);
  });
  it("Multiple tables and LEFT JOIN", () => {
    expectSelectType(
      `
          CREATE TABLE accounts (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              joined_at VARCHAR(250)
          );
          CREATE TABLE users (
              id BIGSERIAL PRIMARY KEY
          );
          CREATE TABLE locations (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              state VARCHAR(250) NOT NULL,
              country VARCHAR(250) NOT NULL
          );
        `,
      `SELECT users.id, state, joined_at FROM accounts, users LEFT JOIN locations ON (locations.user_id = users.id) WHERE accounts.user_id = users.id`
    ).toEqual([
      { isNullable: true, name: "id", type: "bigserial" },
      { isNullable: false, name: "state", type: "varchar" },
      { isNullable: true, name: "joined_at", type: "varchar" },
    ]);
  });
  it("Multiple tables and INNER JOIN", () => {
    expectSelectType(
      `
          CREATE TABLE accounts (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              joined_at VARCHAR(250)
          );
          CREATE TABLE users (
              id BIGSERIAL PRIMARY KEY
          );
          CREATE TABLE locations (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              state VARCHAR(250) NOT NULL,
              country VARCHAR(250) NOT NULL
          );
      `,
      `SELECT users.id, state, joined_at FROM accounts, users INNER JOIN locations ON (locations.user_id = users.id) WHERE accounts.user_id = users.id`
    ).toEqual([
      { isNullable: true, name: "id", type: "bigserial" },
      { isNullable: false, name: "state", type: "varchar" },
      { isNullable: true, name: "joined_at", type: "varchar" },
    ]);
  });
  it("aliases", () => {
    expectSelectType(
      `
        CREATE TABLE accounts (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
            joined_at VARCHAR(250)
        );
      `,
      `SELECT joined_at as "joinedAt" FROM accounts`
    ).toEqual([{ isNullable: true, name: "joinedAt", type: "varchar" }]);
  });
  it("COUNT function", () => {
    expectSelectType(
      `
        CREATE TABLE accounts (
            id BIGSERIAL PRIMARY KEY,
            user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
            joined_at VARCHAR(250)
        );
    `,
      `SELECT COUNT(user_id) FROM accounts`
    ).toEqual([{ isNullable: false, name: "count", type: "int8" }]);
  });

  it("COUNT star", () => {
    expectSelectType(
      `
          CREATE TABLE accounts (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              joined_at VARCHAR(250)
          );
      `,
      `SELECT COUNT(*) FROM accounts`
    ).toEqual([{ isNullable: false, name: "count", type: "int8" }]);
  });

  it("MIN/MAX function", () => {
    expectSelectType(
      `
          CREATE TABLE accounts (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              joined_at VARCHAR(250)
          );
      `,
      `SELECT MIN(user_id) FROM accounts`
    ).toEqual([{ isNullable: true, name: "min", type: "bigserial" }]);
  });

  it("Nested query in WHERE", () => {
    expectSelectType(
      `
          CREATE TABLE users (
              id BIGSERIAL PRIMARY KEY
          );
          CREATE TABLE accounts (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              joined_at VARCHAR(250)
          );
      `,
      `SELECT joined_at FROM accounts WHERE id = (SELECT user_id FROM accounts WHERE id = 4)`
    ).toEqual([{ isNullable: true, name: "joined_at", type: "varchar" }]);
  });

  it("Nested query in FROM", () => {
    expectSelectType(
      `
          CREATE TABLE users (
              id BIGSERIAL PRIMARY KEY
          );
          CREATE TABLE accounts (
              id BIGSERIAL PRIMARY KEY,
              user_id BIGSERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
              joined_at VARCHAR(250)
          );
      `,
      `SELECT foo.user_id FROM (SELECT user_id FROM accounts WHERE id = 1) as foo`
    ).toEqual([{ isNullable: false, name: "user_id", type: "bigserial" }]);
  });
});
