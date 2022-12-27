ALTER TABLE ONLY accounts ALTER id SET DEFAULT 1;

ALTER TABLE public.accounts ALTER id SET DEFAULT '1';

ALTER TABLE IF EXISTS accounts ALTER id SET DEFAULT '1';

ALTER TABLE IF EXISTS ONLY accounts ALTER id SET DEFAULT TRUE;

ALTER TABLE IF EXISTS ONLY accounts ALTER id SET DEFAULT foo();

-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
ALTER TABLE IF EXISTS ONLY accounts
	-- 7
	-- 8
	-- 9
	-- 10
	-- 11
	-- 12
	-- 13
	-- 14
	-- 15
	ALTER id SET DEFAULT foo('foo', 1);

-- 1
-- 2
-- 3
-- yoyo
ALTER TABLE foo
	-- 4
	-- 5
	-- 6
	-- 7
	-- 8
	-- 9
	-- 10
	-- 11
	-- 12
	ADD buckets INTEGER NOT NULL DEFAULT foo('');

ALTER TABLE foo
	-- bar 
	-- foo
	ADD buckets INTEGER PRIMARY KEY,
	-- foo
	-- bar
	DROP foo;

ALTER TABLE ONLY accounts
	-- foo
	-- 1
	-- 2
	-- 3
	-- 4
	-- 5
	-- 6
	ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY institutions
	ADD CONSTRAINT institutions_plaid_type_key UNIQUE (plaid_type);

-- foo
ALTER TABLE ONLY foo
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
	ADD CONSTRAINT foo_bar_id_fkey FOREIGN KEY (bar_id) REFERENCES bar (id);

ALTER TABLE ONLY foo_boo_fooboo
	ADD CONSTRAINT foo_boo FOREIGN KEY (boo) REFERENCES fooo (id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE foobar ALTER COLUMN a DROP NOT NULL;

ALTER TABLE foobar2 ALTER b DROP DEFAULT;

ALTER TABLE foozbar ALTER COLUMN name TYPE VARCHAR(1024);

ALTER TABLE foo ALTER COLUMN foo SET NOT NULL;

ALTER TABLE foo DROP CONSTRAINT my_bar_constraint;

ALTER TABLE foobar
	DROP CONSTRAINT my_constraint,
	ADD CONSTRAINT my_other_constraint FOREIGN KEY (field) REFERENCES mytable (id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE foo."fooTable" ADD foocolumn VARCHAR(255);

ALTER TABLE foo."fooTable"
	ADD foocolumnlist VARCHAR(255)[],
	ADD barcolumnlist INTEGER[],
	ADD barfoocolumnlist TIMESTAMPTZ[];

ALTER TABLE foo
	ADD bar VARCHAR(255)[] NOT NULL DEFAULT ARRAY['push', 'email']::VARCHAR(255)[];