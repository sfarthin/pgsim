-- SELECT from dump.
SELECT false;
SELECT false, true;
select 2;
select 2.0;

SELECT 
-- foo
false, 
-- bar
true;

-- one-off
SELECT pg_catalog.set_config('search_path', '', false);
select nextval('accounts_id_seq' :: regclass);

-- Can wrap in typecast or parens
SELECT 4::text;
SELECT (4);
SELECT -4;
SELECT - 4;

-- We can use STAR
SELECT * FROM foo;
SELECT count(*) from foo;

-- We can give aliases
SELECT 1 foo;
SELECT 1 as foo;
SELECT * FROM users as u;
SELECT * FROM users u;

-- We can do ordering.
SELECT 1 ORDER BY 1;
SELECT 1 ORDER BY 1 DESC;
SELECT 1 ORDER BY 1 ASC;
SELECT 1, 2 ORDER BY 1 ASC, 2;
SELECT 1, 2 as foo ORDER BY 1 ASC, foo;