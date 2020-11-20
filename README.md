# PGSIM

PGSIM is a parser, linter and static analysis tool for Postgres. It can parse Postgres SQL then determine the schema and the result type of queries.

### Schema

PGSIM maintain an in-memory representation of the Postgres "schema" given DDL SQL statements (i.e. `CREATE`, `ALTER`, `DROP`). The resulting condensed DDL can be outputed to match `pg_dump`.

### Input and Output Types

Given a DML SQL statements (i.e. `SELECT`, `INSERT`, `UPDATE`, `DELETE`), PGSIM can validate and infer the input and output types given a schema.

### Support

It supports "Create Table", Alter, Insert, Select, Index, Update, "Create Enum", Comment and ViewStmt.

## For Developers

This is a mono-repo, but doesn't use yarn workspaces or learna. Should be dependency-less in the near future when the parser uses PEGJS.

### Running tests

The test suite for this project is a little bit different from "normal"
JavaScript/Typescript project tests. It's invoked by

    $ ./bin/pgsim-test

It will do the following for all fixtures files found in `/fixtures/regress/*.sql`:

1. Run test files against a real, running, Postgres database. Output to
   `tests/real/*.sql`.
1. Run test files against the simulator. Output to `tests/simulated/*.sql`.
1. Diff the results. No diff means test suite passes.

This setup offers the level of confidence that the simulator is actually
working as expected, and at the same time makes it really easy to add specific
test cases later on: simply add a new `*.sql` file!

# TODO

1. Create AST writer and test that the output of "pg*dump" matches. Similar to tests here https://github.com/SimpleContacts/mysql-simulator. Use Docker: https://hub.docker.com/*/postgres
2. Write PEG.JS parser rather than using native parser
