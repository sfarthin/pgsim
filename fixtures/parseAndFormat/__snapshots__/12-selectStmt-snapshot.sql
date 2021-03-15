-- SELECT from dump.
SELECT
	FALSE;

SELECT
	pg_catalog.set_config('search_path', '', FALSE);

SELECT
	nextval('accounts_id_seq'::regclass);
