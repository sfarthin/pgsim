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

CREATE INDEX foo ON foo_bar USING gin (foo_id);

CREATE UNIQUE INDEX dismissed_offers_user_service_offer_placement_sub_idx
	ON dismissed_offers (user_id, service_offer_id, placement, subscription_id);
	

CREATE UNIQUE INDEX dismissed_offers_user_id_service_offer_id_placement
	ON dismissed_offers (user_id, service_offer_id, placement)
	WHERE subscription_id IS NULL;

CREATE INDEX foo ON foobar (foo DESC);

CREATE INDEX foo ON foobar (foo ASC);

CREATE INDEX foo ON foobar (foo ASC NULLS FIRST);

CREATE INDEX foo ON foobar (foo ASC NULLS LAST);

CREATE INDEX CONCURRENTLY foo_idx ON foo (bar);

-- CREATE INDEX foobar ON app_installs((data->>'ip'));