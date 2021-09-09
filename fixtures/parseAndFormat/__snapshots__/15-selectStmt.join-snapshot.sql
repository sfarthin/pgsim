SELECT
	*
FROM
	foo JOIN bar ON (
		bar.foo_id = foo.id AND
		foo.created_at = now()
	);

SELECT
	*
FROM
	foo LEFT JOIN bar ON (
		bar.foo_id = foo.id AND
		foo.created_at = now()
	);

SELECT
	*
FROM
	foo JOIN bar ON (
		bar.foo_id = foo.id AND
		foo.created_at = now()
	);

SELECT
	*
FROM
	foo RIGHT JOIN bar AS b ON (
		b.foo_id = foo.id AND
		foo.created_at = now()
	);