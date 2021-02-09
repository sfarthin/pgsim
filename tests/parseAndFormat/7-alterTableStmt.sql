ALTER TABLE ONLY accounts ALTER COLUMN id SET DEFAULT 1;

ALTER TABLE accounts ALTER COLUMN id SET DEFAULT '1';

ALTER TABLE IF exists accounts ALTER COLUMN id SET DEFAULT '1';
ALTER TABLE IF exists ONLY accounts ALTER COLUMN id SET DEFAULT true;

ALTER TABLE IF exists ONLY accounts ALTER id SET DEFAULT foo();

/* 1 */ALTER/* 2 */TABLE/* 3 */IF /* 4 */exists -- 5
ONLY /* 6 */accounts /*7*/ALTER /* 8 */COLUMN /* 9 */id /* 10 */SET /* 11 */DEFAULT /* 12 */foo/* 13 */('foo' /* 14 */, /* 15 */1);


/* 1 */ALTER /* 2 */TABLE /* 3 */foo /* 4 */ADD /* 5 */buckets /* 6 */int /* 7 */NOT /* 8 */NULL /* 9 */DEFAULT /* 10 */foo/* 11 */('')/* 12 */; -- yoyo

alter table foo 
--bar 
    add/* foo */ buckets int PRIMARY KEY, -- foo
    -- bar
    drop foo;

ALTER TABLE ONLY accounts
-- foo
    ADD/* 1 */ CONSTRAINT /* 2 */accounts_pkey /* 3 */PRIMARY KEY/* 4 */ (/* 5 */id /* 6 */);

ALTER TABLE ONLY institutions ADD CONSTRAINT institutions_plaid_type_key UNIQUE (plaid_type);

-- foo
ALTER TABLE ONLY foo
    -- 1
    ADD /* 2 */CONSTRAINT /* 3 */ foo_bar_id_fkey /* 4 */ FOREIGN KEY /* 5 */ ( /* 6 */bar_id/* 7 */)/* 8 */ REFERENCES /* 9 */bar/* 10 */(id)/* 11 */;

ALTER TABLE ONLY accounts
    ADD CONSTRAINT accounts_master_account_id_fkey FOREIGN KEY (master_account_id) REFERENCES master_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE