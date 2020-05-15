import { toSchemaFromString, PGErrorCode, toTableFields } from "../src";

const expectTableFields = (sql: string) =>
  expect(toTableFields(toSchemaFromString(sql)));

describe("toSchema", () => {
  it("find duplicate create table definitions", () => {
    try {
      expectTableFields(`
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY
        );
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY
        );
    `);
    } catch (e) {
      if (e.id !== PGErrorCode.INVALID) {
        throw e;
      }
    }
  });

  it("finds ALTER TABLE statements without references", () => {
    try {
      expectTableFields(`
        ALTER TABLE users ADD email VARCHAR(250);
    `);
    } catch (e) {
      if (e.id !== PGErrorCode.INVALID) {
        throw e;
      }
    }
  });

  it("can use ALTER TABLE to add columns", () => {
    expectTableFields(`
        CREATE TABLE "foo" (
            id BIGSERIAL PRIMARY KEY
        );
        ALTER TABLE "foo" ADD email VARCHAR(250);
    `).toEqual([
      {
        name: "foo",
        fields: [
          {
            name: "id",
            type: "bigserial",
            isNullable: true,
            references: null,
            isPrimaryKey: true,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: true,
            references: null,
            isPrimaryKey: false,
          },
        ],
      },
    ]);
  });
});
