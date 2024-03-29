-- DROP SEQUENCE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
-- 1
-- 2
-- 3
DROP SEQUENCE foo;

-- DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
DROP TABLE foo;

-- DROP TYPE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
DROP TYPE foo;

DROP TABLE IF EXISTS foo;

DROP TYPE IF EXISTS foo;

-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
DROP SEQUENCE IF EXISTS foo;

DROP TABLE yo CASCADE;

-- yo
-- yo
DROP TABLE yo;

DROP VIEW subscription_amount_rollups;

DROP MATERIALIZED VIEW IF EXISTS account_data;

DROP INDEX CONCURRENTLY IF EXISTS some_index;