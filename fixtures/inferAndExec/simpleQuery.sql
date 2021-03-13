create table foo (column1 INT);

INSERT INTO (column1) VALUES(1);

SELECT * FROM foo;

-- Each statement is executed with `pg` npm module, the result is an array of results.
-- Make sure both results are the same... ["CREATE 1", "INSERT 1", [{ column1: 1 }] ]
-- Make sure the type inference matches results.