-- CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ name ] ON table [ USING method ]
--     ( { column | ( expression ) } [ COLLATE collation ] [ opclass ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
--     [ WITH ( storage_parameter = value [, ... ] ) ]
--     [ TABLESPACE tablespace ]
--     [ WHERE predicate ]

CREATE UNIQUE INDEX foo ON foo_bar (plaid_id);

-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
-- 7
-- 8
-- 9
-- 10
-- 11
-- 12
CREATE INDEX foo ON foo_bar (plaid_id);

CREATE INDEX ON foo_bar (foo);

CREATE UNIQUE INDEX foo ON foo_bar USING hash (plaid_id);

CREATE UNIQUE INDEX foo ON foo_bar USING hash (plaid_id, foobar);
