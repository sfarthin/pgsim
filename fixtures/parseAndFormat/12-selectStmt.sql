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