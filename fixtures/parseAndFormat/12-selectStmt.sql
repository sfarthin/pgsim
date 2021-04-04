-- SELECT from dump.
SELECT false;
SELECT false, true;

SELECT 
-- foo
false, 
-- bar
true;
SELECT pg_catalog.set_config('search_path', '', false);
select nextval('accounts_id_seq' :: regclass);

SELECT 4::text;

SELECT (4);

SELECT * FROM foo;

SELECT 1 as foo;

SELECT 1 ORDER BY 1;

SELECT 1 ORDER BY 1 DESC;
SELECT 1 ORDER BY 1 ASC;
SELECT 1, 2 ORDER BY 1 ASC, 2;
SELECT 1, 2 as foo ORDER BY 1 ASC, foo;