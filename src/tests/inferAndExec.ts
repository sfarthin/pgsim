// Take some SQL, load it into database, output information_schema
// assert-no-diff with output from our code output.

// ^^ This will effectively allow us to create an adapter for pg-structure.

// From our information_schema, translate contents into a series of "create table" AST. This will be effectively pg_dump.
// We can confirm its correctness by reading out output and confirm it makes the same information_schema.
// Similar in how we can go back and forth from pg SQL <-> AST. We can also cyclicly
// go from SQL -> AST -> DB -> AST -> SQL. We can confirm both
// ends equal the same.

// We will be able to...
// parse = SQL -> AST
// format = AST -> SQL
// run = AST -> DB ... with options for schema only
// dump = DB -> AST ... with options for data
// infer = SQL -> "Type definition"

// We can ensure DB is the same by doing a mysql_dump and ensuring its the same.

// Parses SQL and runs them one-by-one using pg module then confirm output matches codebase runtime.

// We need to handle prepared queries
// https://node-postgres.com/features/queries
// https://www.postgresql.org/docs/current/sql-prepare.html#:~:text=A%20prepared%20statement%20is%20a,statement%20is%20planned%20and%20executed.
// PREPARE fooplan (int, text, bool, numeric) AS
//     INSERT INTO foo VALUES($1, $2, $3, $4);
// EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);

// This effectively builds off the work we started in schema.

// Snapshot output of types for prepared snapshot inputs (tuple) and query outputs. Default to unknown
