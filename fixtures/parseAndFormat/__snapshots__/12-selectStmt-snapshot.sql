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

SELECT
	1 AS foo;

SELECT
	1 AS "Foo";

SELECT
	foo
FROM
	public.foo;

SELECT
	foo
FROM
	foo
	JOIN
		bar
		ON (
			foo.id = bar.id
		);

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

SELECT
	'1'::int4;

SELECT
	||/ '1'::int4;

SELECT
	||/ -1;

-- Can handle big ints and negatives
SELECT
	2147483647;

SELECT
	2147483648;

SELECT
	-4;

SELECT
	-49999999999999999999999999999999999999999999999999999999999999999999999999999999;

SELECT
	-4;

-- Can handle various expressions with different operations.
SELECT
	4 < 4.0 * 3;

SELECT
	4 * 4.0 < 3;

SELECT
	4 * 4.0 * 3;

SELECT
	4 - 4.0 * 3;

SELECT
	4 - 4.0 + 3;

SELECT
	4 * 4.0 / 3;

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
	1 AS foo;

SELECT
	NULL;

SELECT
	1 IS NOT NULL;

SELECT
	1 IS NULL;

SELECT
	*
FROM
	users AS u;

SELECT
	*
FROM
	users AS u;

SELECT
	*
FROM
	schema.u;

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

SELECT
	foo['2'];

SELECT
	foo(c.foo);

-- Precedence
SELECT
	1 + 1::int4;

SELECT
	1::int4 + 1;

SELECT
	foo[0] + 1;

SELECT
	1 + foo[0];

SELECT
	foo::int4;

SELECT
	5! - 6;

SELECT
	1 * 2 - 3;

SELECT
	1 * (2 - 3);

SELECT
	1 - 2 - 3;

SELECT
	1 - 2 - -3;

SELECT
	-2 - 2;

SELECT
	-2 - -2.20;

SELECT
	1 + 2 ^ 2;

SELECT
	2 ^ 2 + 1;

SELECT
	1 * 2 + 3;

SELECT
	2 + 2 * 2;

SELECT
	2 + 2 * 2;

SELECT
	0
	 > 
	(
		SELECT
			1
	);

SELECT
	FALSE;

SELECT
	NOT FALSE;

SELECT
	NOT FALSE;

SELECT
	TRUE OR
	FALSE;

SELECT
	TRUE AND
	FALSE;

SELECT
	TRUE OR
	TRUE OR
	TRUE;

SELECT
	TRUE OR
	FALSE AND
	TRUE;

SELECT
	TRUE AND
	FALSE OR
	TRUE;

SELECT
	FALSE AND
	(
		FALSE OR
		TRUE
	);

SELECT
	TRUE AND
	FALSE OR
	TRUE OR
	FALSE;

SELECT
	TRUE AND
	TRUE AND
	FALSE OR
	TRUE;

SELECT
	TRUE AND
	TRUE AND
	(
		FALSE OR
		TRUE
	);

SELECT
	TRUE OR
	TRUE OR
	(
		FALSE OR
		TRUE
	);

SELECT
	(
		FALSE OR
		TRUE
	) AND
	TRUE;

SELECT
	(
		FALSE OR
		TRUE
	) AND
	NOT TRUE;

SELECT
	(
		FALSE OR
		FALSE AND
		(
			TRUE OR
			FALSE
		)
	) AND
	(
		FALSE OR
		FALSE AND
		(
			TRUE OR
			FALSE
		)
	);

SELECT
	4 IN (
		1,
		2,
		3,
		4
	);

SELECT
	400 IN (
		SELECT
			4
	);

SELECT
	1 = 1;

SELECT
	1 = 1 AND
	2 = 2;

SELECT
	1 = 1 AND
	TRUE;

SELECT
	TRUE AND
	1 = 1;

SELECT
	(1, '2'::text, (1, 2, asdsad));

SELECT
	1 IN (
		1,
		2,
		3
	);

SELECT
	'1' || '2';

SELECT
	1 AND
	2;