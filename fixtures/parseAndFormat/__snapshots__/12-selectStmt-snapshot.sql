-- SELECT from dump.
SELECT
	FALSE;

SELECT
	FALSE,
	TRUE;

SELECT
	-- foo
	FALSE,
	-- bar
	TRUE;

SELECT
	pg_catalog.set_config('search_path', '', FALSE);

SELECT
	nextval('accounts_id_seq'::regclass);

SELECT
	4::text;

SELECT
	4;

SELECT
	*
FROM
	foo;

SELECT
	1 AS foo;

SELECT
	1
ORDER BY
	1;

SELECT
	1
ORDER BY
	1 DESC;

SELECT
	1
ORDER BY
	1 ASC;

SELECT
	1,
	2
ORDER BY
	1 ASC,
	2;

SELECT
	1,
	2 AS foo
ORDER BY
	1 ASC,
	foo;