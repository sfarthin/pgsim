// Parses SQL and runs them one-by-one using pg module then confirm the out matches codebase runtime.

// We need to handle prepared queries
// https://node-postgres.com/features/queries
// https://www.postgresql.org/docs/current/sql-prepare.html#:~:text=A%20prepared%20statement%20is%20a,statement%20is%20planned%20and%20executed.
// PREPARE fooplan (int, text, bool, numeric) AS
//     INSERT INTO foo VALUES($1, $2, $3, $4);
// EXECUTE fooplan(1, 'Hunter Valley', 't', 200.00);
