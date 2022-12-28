-- DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
--     [ USING from_item [, ...] ]
--     [ WHERE condition | WHERE CURRENT OF cursor_name ]
--     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]


-- 1
DELETE/* 2 */FROM/* 3 */public.foo 
-- 4
WHERE /* 5 */ foo =/* 6 */ 1; -- 7
DELETE FROM foo;

DELETE from foo using foobar as foo2 LEFT JOIN cool on (foo2.foo = cool.foo) WHERE feed_events.id = fe.id;