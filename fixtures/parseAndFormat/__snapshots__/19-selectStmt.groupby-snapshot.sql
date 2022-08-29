SELECT * FROM foo GROUP BY created_at;

SELECT
	*
FROM
	foo
GROUP BY
	-- foo
	created_at;

SELECT
	*
FROM
	foo
GROUP BY
	one,
	two,
	-- goo
	three;

SELECT * FROM foo JOIN f ON (TRUE = TRUE);

-- SELECT * FROM foo JOIN f ON (true=true);
SELECT
	*
FROM
	foo JOIN f ON (TRUE = TRUE AND FALSE = FALSE AND 1 = 1)
GROUP BY a.b, c;

SELECT * FROM foo WHERE 1 = 1 GROUP BY a.b, c;