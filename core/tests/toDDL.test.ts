import { toDDLFromString } from "../src";

describe("toDDL", () => {
  it("can do things", () => {
    expect(
      toDDLFromString(`
            -- id INT NULL DEFAULT NULL
            CREATE TABLE foo (id INT);
            
            -- id INT NOT NULL
            CREATE TABLE bar (id INT, PRIMARY KEY (id));
            
            -- Same as "bar", but in two steps
            CREATE TABLE qux (id INT);
            ALTER TABLE qux ADD PRIMARY KEY (id);            
    `)
    ).toMatchSnapshot();
  });
});
