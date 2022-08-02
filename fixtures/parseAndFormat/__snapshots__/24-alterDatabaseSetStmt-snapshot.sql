-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
-- 7
-- 8
ALTER DATABASE truebill_development SET log_statement TO 'all';

ALTER DATABASE some_other_name SET configuration_parameter TO 'value';

ALTER DATABASE name RESET configuration_parameter;

ALTER DATABASE name RESET ALL;

ALTER DATABASE foo SET some_other_thing TO 1;

ALTER DATABASE name SET configuration_parameter TO DEFAULT;

ALTER DATABASE name SET configuration_parameter FROM CURRENT;