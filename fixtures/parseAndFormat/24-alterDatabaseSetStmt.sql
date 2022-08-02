-- 1
ALTER/* 2 */DATABASE/* 3 */truebill_development/* 4 */SET/* 5 */log_statement/* 6 */=/* 7 */'all'; -- 8
ALTER DATABASE some_other_name SET configuration_parameter TO value;
ALTER DATABASE name RESET configuration_parameter;
ALTER DATABASE name RESET ALL;
ALTER DATABASE foo SET some_other_thing to 1; 
ALTER DATABASE name SET configuration_parameter TO DEFAULT;
ALTER DATABASE name SET configuration_parameter FROM CURRENT;