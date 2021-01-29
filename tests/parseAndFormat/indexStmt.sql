-- CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ name ] ON table [ USING method ]
--     ( { column | ( expression ) } [ COLLATE collation ] [ opclass ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
--     [ WITH ( storage_parameter = value [, ... ] ) ]
--     [ TABLESPACE tablespace ]
--     [ WHERE predicate ]

CREATE UNIQUE INDEX accounts_plaid_id ON accounts USING btree (plaid_id)