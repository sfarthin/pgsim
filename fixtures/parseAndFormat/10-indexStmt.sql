-- CREATE [ UNIQUE ] INDEX [ CONCURRENTLY ] [ name ] ON table [ USING method ]
--     ( { column | ( expression ) } [ COLLATE collation ] [ opclass ] [ ASC | DESC ] [ NULLS { FIRST | LAST } ] [, ...] )
--     [ WITH ( storage_parameter = value [, ... ] ) ]
--     [ TABLESPACE tablespace ]
--     [ WHERE predicate ]

CREATE UNIQUE INDEX foo ON foo_bar USING btree (plaid_id);

-- 1
/* 2 */ CREATE /* 3 */ INDEX/* 4 */foo/* 5 */ON/* 6 */foo_bar/* 7 */USING/* 8 */btree/* 9 */(/* 10 */plaid_id/* 11 */); -- 12

CREATE INDEX ON foo_bar (foo);

CREATE UNIQUE INDEX foo ON foo_bar USING hash (plaid_id);

CREATE UNIQUE INDEX foo ON foo_bar USING hash (plaid_id, foobar);

CREATE INDEX foo ON foo_bar USING GIN (foo_id);

CREATE UNIQUE INDEX dismissed_offers_user_service_offer_placement_sub_idx ON dismissed_offers (user_id, service_offer_id, placement, subscription_id);

CREATE UNIQUE INDEX dismissed_offers_user_id_service_offer_id_placement
         ON dismissed_offers USING btree (user_id, service_offer_id, placement)
         WHERE subscription_id IS NULL;

CREATE INDEX foo ON foobar (foo DESC);
CREATE INDEX foo ON foobar (foo ASC);

CREATE INDEX foo ON foobar (foo ASC NULLS FIRST);
CREATE INDEX foo ON foobar (foo ASC NULLS LAST);