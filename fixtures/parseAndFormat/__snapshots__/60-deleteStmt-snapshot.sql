-- DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
--     [ USING from_item [, ...] ]
--     [ WHERE condition | WHERE CURRENT OF cursor_name ]
--     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
-- 7
DELETE FROM public.foo WHERE foo = 1;

DELETE FROM foo;

DELETE FROM foo
USING
	foobar AS foo2
	LEFT JOIN cool ON (foo2.foo = cool.foo)
WHERE
	feed_events.id = fe.id;