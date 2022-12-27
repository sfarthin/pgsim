SELECT * FROM foo JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

SELECT
	*
FROM
	foo LEFT JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

SELECT * FROM foo JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

SELECT
	*
FROM
	foo LEFT JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

SELECT
	*
FROM
	foo RIGHT JOIN bar AS b ON (b.foo_id = foo.id AND foo.created_at = now());

SELECT * FROM foo LEFT JOIN (SELECT 1) AS sq ON (1 = 1);

SELECT * FROM foo, bar WHERE foo.bar_id = bar.id;

SELECT
	*
FROM
	foo, bar
WHERE
	foo.table_schema = bar.table_schema AND
	foo.table_name = bar.table_name AND
	foo.constraint_name = bar.constraint_name AND
	foo.constraint_type = 'PRIMARY KEY';

SELECT * FROM (SELECT 1) AS s, z;

-- SELECT * FROM (SELECT 1) s LEFT JOIN foo on 1 = 1, z WHERE 1 = 1;
SELECT
	*
FROM
	foobar
	RIGHT JOIN foo ON (1 = 1)
	LEFT JOIN bar ON (1 = 1)
	LEFT JOIN yo ON (1 = 1)
	JOIN hello ON (1 = 1);