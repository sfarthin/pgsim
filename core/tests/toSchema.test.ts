import { toSchemaFromString, PGErrorCode } from "../src";

const expectTableFields = (sql: string) =>
  expect(
    toSchemaFromString(sql).tables.map(({ name, fields }) => ({ name, fields }))
  );

describe("toSchema", () => {
  it("find duplicate create table definitions", () => {
    let err;
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
      err = e;
    }

    expect(err?.id).toEqual(PGErrorCode.INVALID);
  });

  it("finds ALTER TABLE statements without references", () => {
    let err;
    try {
      expectTableFields(`
        ALTER TABLE users ADD email VARCHAR(250);
    `);
    } catch (e) {
      err = e;
    }

    expect(err?.id).toEqual(PGErrorCode.INVALID);
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
