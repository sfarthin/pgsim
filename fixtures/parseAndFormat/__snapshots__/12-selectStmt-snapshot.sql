-- SELECT from dump.
SELECT
	FALSE;

SELECT
	FALSE,
	TRUE;

SELECT
	2;

SELECT
	2.0;

SELECT
	-- foo
	FALSE,
	-- bar
	TRUE;

-- one-off
SELECT
	pg_catalog.set_config('search_path', '', FALSE);

SELECT
	nextval('accounts_id_seq'::regclass);

-- Can wrap in typecast or parens
SELECT
	4::text;

SELECT
	4;

-- We can use STAR
SELECT
	*
FROM
	foo;

SELECT
	count(*)
FROM
	foo;

-- We can give aliases
SELECT
	1 AS foo;

SELECT
	1 AS foo;

SELECT
	*
FROM
	users AS u;

SELECT
	*
FROM
	users AS u;

-- We can do ordering.
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