-- Top 1
-- Top 2

-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
-- 7
-- 8
CREATE TYPE foo AS ENUM (
	-- 9
	-- comment on a
	'a',
	'b',
	-- comment on b
	-- 10
	-- comment on c
	'c',
	-- comment on d
	'd',
	-- comment on e
	-- 11
	'e'
);

-- Bottom 1
-- Bottom 2

CREATE TYPE public.enum_feed_events_type AS ENUM (
	'subscription_charge',
	'overdraft_fee',
	'late_payment_fee',
	'insufficient_funds_fee',
	'interest_charged'
);