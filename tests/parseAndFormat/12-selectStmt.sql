-- SELECT from dump.
SELECT false;
SELECT pg_catalog.set_config('search_path', '', false);
select nextval('accounts_id_seq' :: regclass);