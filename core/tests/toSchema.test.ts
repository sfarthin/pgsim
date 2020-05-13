import toSchema from "../src/toSchema";

const expectTableFields = (sql: string) =>
  expect(toSchema(sql).tables.map(({ fields }) => fields));

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

    expect(err).toBeTruthy();
  });

  it("finds ALTER TABLE statements without references", () => {
    let err;
    try {
      expectTableFields(`
        ALTER TABLE users ADD COLUMN email VARCHAR(250);
    `);
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
  });

  it("can use ALTER TABLE to add columns", () => {
    expectTableFields(`
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY
        );
        ALTER TABLE users ADD COLUMN email VARCHAR(250);
    `).toEqual([
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
    ]);
  });
});
