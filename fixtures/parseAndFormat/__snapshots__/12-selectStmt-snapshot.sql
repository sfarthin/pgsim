-- SELECT from dump.
SELECT
	FALSE;

SELECT
	FALSE,
	TRUE;

SELECT
	pg_catalog.set_config('search_path', '', FALSE);

SELECT
	nextval('accounts_id_seq'::regclass);