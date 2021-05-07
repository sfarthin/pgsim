-- https://www.postgresql.org/docs/9.1/functions-datetime.html

SELECT
	'2001-09-28'::date;

-- SELECT '2001-09-28'::int4 + '7'::int4;
-- SELECT date '2001-09-28' + integer '7'; -- date '2001-10-05'
-- SELECT date '2001-09-28' + interval '1 hour'; --	timestamp '2001-09-28 01:00:00'
-- SELECT date '2001-09-28' + time '03:00'; --	timestamp '2001-09-28 03:00:00'
-- SELECT interval '1 day' + interval '1 hour'; --	interval '1 day 01:00:00'
-- SELECT timestamp '2001-09-28 01:00' + interval '23 hours'; --	timestamp '2001-09-29 00:00:00'
-- SELECT time '01:00' + interval '3 hours'; --	time '04:00:00'
-- SELECT - interval '23 hours'; --	interval '-23:00:00'
-- SELECT date '2001-10-01' - date '2001-09-28'; --	integer '3' (days)
-- SELECT date '2001-10-01' - integer '7'; --	date '2001-09-24'
-- SELECT date '2001-09-28' - interval '1 hour'; --	timestamp '2001-09-27 23:00:00'
-- SELECT time '05:00' - time '03:00'; --	interval '02:00:00'
-- SELECT time '05:00' - interval '2 hours'; --	time '03:00:00'
-- SELECT timestamp '2001-09-28 23:00' - interval '23 hours'; --	timestamp '2001-09-28 00:00:00'
-- SELECT interval '1 day' - interval '1 hour'; -- 	interval '1 day -01:00:00'
-- SELECT timestamp '2001-09-29 03:00' - timestamp '2001-09-27 12:00'; --	interval '1 day 15:00:00'
-- SELECT 900 * interval '1 second'; --	interval '00:15:00'
-- SELECT 21 * interval '1 day'; --	interval '21 days'
-- SELECT double precision '3.5' * interval '1 hour'; --	interval '03:30:00'
-- SELECT interval '1 hour' / double precision '1.5'; --	interval '00:40:00'