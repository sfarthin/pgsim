-- SELECT from dump.
SELECT FALSE;

SELECT FALSE, TRUE;

SELECT 2;

SELECT 2.0;

SELECT avg(b)::DECIMAL;

SELECT avg(b)::DECIMAL(10,3);

SELECT
	-- foo
	FALSE,
	-- bar
	TRUE;

SELECT TRUE = TRUE;

SELECT 1 AS foo;

SELECT 1 AS "Foo";

SELECT foo FROM public.foo;

SELECT foo FROM foo JOIN bar ON (foo.id = bar.id);

-- one-off
SELECT pg_catalog.set_config('search_path', '', FALSE);

SELECT nextval('accounts_id_seq'::regclass);

-- Can wrap in typecast or parens
SELECT 4::TEXT;

SELECT 4;

SELECT '1'::INTEGER;

SELECT ||/ '1'::INTEGER;

SELECT ||/ -1;

-- Can handle big ints and negatives
SELECT 2147483647;

SELECT 2147483648;

SELECT -4;

SELECT
	-49999999999999999999999999999999999999999999999999999999999999999999999999999999;

SELECT -4;

-- Can handle various expressions with different operations.
SELECT 4 < 4.0 * 3;

SELECT 4 * 4.0 < 3;

SELECT 4 * 4.0 * 3;

SELECT 4 - 4.0 * 3;

SELECT 4 - 4.0 + 3;

SELECT 4 * 4.0 / 3;

-- We can use STAR
SELECT * FROM foo;

SELECT count(*) FROM foo;

-- We can give aliases
SELECT 1 AS foo;

SELECT 1 AS foo;

SELECT 1 AS foo;

SELECT NULL;

SELECT 1 IS NOT NULL;

SELECT 1 IS NULL;

SELECT * FROM users AS u;

SELECT * FROM users AS u;

SELECT * FROM schema.u;

-- We can do ordering.
SELECT 1 ORDER BY 1;

SELECT 1 ORDER BY 1 DESC;

SELECT 1 ORDER BY 1 ASC;

SELECT 1, 2 ORDER BY 1 ASC, 2;

SELECT 1, 2 AS foo ORDER BY 1 ASC, foo;

SELECT foo['1'];

SELECT foo['2'];

SELECT foo(c.foo);

-- Precedence
SELECT 1 + 1::INTEGER;

SELECT 1::INTEGER + 1;

SELECT foo[0] + 1;

SELECT 1 + foo[0];

SELECT foo::INTEGER;

SELECT 5! - 6;

SELECT 1 * 2 - 3;

SELECT 1 * (2 - 3);

SELECT 1 - 2 - 3;

SELECT 1 - 2 - -3;

SELECT -2 - 2;

SELECT -2 - -2.20;

SELECT 1 + 2 ^ 2;

SELECT 2 ^ 2 + 1;

SELECT 1 * 2 + 3;

SELECT 2 + 2 * 2;

SELECT 2 + 2 * 2;

SELECT 0 > (SELECT 1);

SELECT FALSE;

SELECT NOT FALSE;

SELECT NOT FALSE;

SELECT TRUE OR FALSE;

SELECT TRUE AND FALSE;

SELECT TRUE OR TRUE OR TRUE;

SELECT TRUE OR FALSE AND TRUE;

SELECT TRUE AND FALSE OR TRUE;

SELECT FALSE AND (FALSE OR TRUE);

SELECT TRUE AND FALSE OR TRUE OR FALSE;

SELECT TRUE AND TRUE AND FALSE OR TRUE;

SELECT TRUE AND TRUE AND (FALSE OR TRUE);

SELECT TRUE OR TRUE OR (FALSE OR TRUE);

SELECT (FALSE OR TRUE) AND TRUE;

SELECT (FALSE OR TRUE) AND NOT TRUE;

SELECT
	(FALSE OR FALSE AND (TRUE OR FALSE)) AND (FALSE OR FALSE AND (TRUE OR FALSE));

SELECT 4 IN (1, 2, 3, 4);

SELECT 400 IN (SELECT 4);

SELECT 1 = 1;

SELECT 1 = 1 AND 2 = 2;

SELECT 1 = 1 AND TRUE;

SELECT TRUE AND 1 = 1;

SELECT (1, '2'::TEXT, (1, 2, asdsad));

SELECT 1 IN (1, 2, 3);

SELECT '1' || '2';

SELECT 1 AND 2;

SELECT * FROM foo WHERE 0 < (SELECT 1);

SELECT 1 > 3;

SELECT foobar = bar;

SELECT TRUE = TRUE;

SELECT TRUE = TRUE;

SELECT 1;

-- select 2
SELECT INTERVAL '2 days ago';

SELECT '1.1'::BIGINT;

-- TODO properally fill out support for interval.
-- SELECT INTERVAL '145 seconds ago' MINUTE;
-- SELECT INTERVAL '145 seconds ago' HOUR;

WITH regional_sales AS (SELECT 1) SELECT 2;

WITH regional_sales AS (
	SELECT 1
), 
top_regions AS (
	SELECT TRUE AND FALSE OR TRUE OR FALSE
)
SELECT
	3;

SELECT * FROM foo WHERE foo.t LIKE '%foo%';

SELECT pg_catalog.date_part('year', '2016-12-31 13:30:15'::timestamp);

SELECT foo FROM foobar GROUP BY foo, bar, hoo ORDER BY foo, bar, joo;

SELECT foo FROM foobar GROUP BY 1, 3 ORDER BY 1, 3;

SELECT DISTINCT foo;

SELECT DISTINCT foo, goo;

SELECT count(DISTINCT foo);

SELECT 1 FROM (SELECT 1) AS a;

SELECT 1 FROM (SELECT 1) AS a;

SELECT
	pg_catalog.btrim(regexp_replace(txn.original_description, 'd+/d+(/d+)?', ''));

SELECT pg_catalog.ltrim(foo);

SELECT pg_catalog.rtrim(foo);

SELECT foo.id, count(foo.bar) FROM bar GROUP BY foo.id HAVING count(foo.bar) >= 5;

SELECT
	foo.id, count(foo.bar)
FROM
	bar
GROUP BY foo.id
HAVING
	-- foo
	count(foo.bar) >= 5;

SELECT ARRAY(SELECT id FROM services WHERE slug = 'time-warner-cable');

SELECT ARRAY['foo', 1, foo];

SELECT ARRAY[];

SELECT 'it''s great';

SELECT '{ "message": "it''s great" }';

SELECT 'asdasd' ILIKE '%d';

SELECT array_agg(foo, bar ORDER BY enumsortorder, bar);

SELECT foo FROM bar WHERE 10 NOT IN (1, 2, 4);

SELECT foo IN (SELECT 1);

SELECT NOT bar;

SELECT NOT foo IN (SELECT 1);

SELECT (SELECT 1)->>'ip' FROM foo;

SELECT foo->1 FROM bar;