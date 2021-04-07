SELECT * FROM foo JOIN bar ON bar.foo_id = foo.id AND foo.created_at = NOW();

SELECT * FROM foo LEFT JOIN bar ON bar.foo_id = foo.id AND foo.created_at = NOW();

SELECT * FROM foo INNER JOIN bar ON bar.foo_id = foo.id AND foo.created_at = NOW();

SELECT * FROM foo RIGHT JOIN bar b ON b.foo_id = foo.id AND foo.created_at = NOW();