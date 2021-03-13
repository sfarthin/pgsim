ALTER TABLE ONLY accounts 
	ALTER id SET DEFAULT 1;

ALTER TABLE accounts 
	ALTER id SET DEFAULT '1';

ALTER TABLE IF EXISTS accounts 
	ALTER id SET DEFAULT '1';

ALTER TABLE IF EXISTS ONLY accounts 
	ALTER id SET DEFAULT TRUE;

ALTER TABLE IF EXISTS ONLY accounts 
	ALTER id SET DEFAULT foo();

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
	ADD  CONSTRAINT accounts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY institutions 
	ADD  CONSTRAINT institutions_plaid_type_key UNIQUE (plaid_type);

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
	ADD  CONSTRAINT foo_bar_id_fkey FOREIGN KEY(bar_id) REFERENCES bar(id) ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE ONLY foo_boo_fooboo 
	ADD  CONSTRAINT foo_boo FOREIGN KEY(boo) REFERENCES fooo(id) ON UPDATE CASCADE ON DELETE CASCADE;
