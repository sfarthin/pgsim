SELECT * FROM foo JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

SELECT
	*
FROM
	foo LEFT JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

SELECT * FROM foo JOIN bar ON (bar.foo_id = foo.id AND foo.created_at = now());

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