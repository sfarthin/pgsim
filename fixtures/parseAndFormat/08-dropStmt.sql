-- DROP SEQUENCE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
drop/* 1 */sequence /* 2 */ foo; -- 3

-- DROP TABLE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
drop table foo;

-- DROP TYPE [ IF EXISTS ] name [, ...] [ CASCADE | RESTRICT ]
drop type foo;

drop TABLE IF EXISTS foo;
drop type IF EXISTS foo;
/* 1 */drop /* 2 */sequence /* 3 */IF /* 4 */EXISTS /* 5 */foo; -- 6

drop table yo CASCADE;
drop table yo /* yo */RESTRICT/* yo */;

DROP VIEW subscription_amount_rollups;

DROP MATERIALIZED VIEW IF EXISTS account_data;