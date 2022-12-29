ALTER TABLE ONLY accounts ALTER COLUMN id SET DEFAULT 1;

ALTER TABLE public.accounts ALTER COLUMN id SET DEFAULT '1';

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

ALTER TABLE ONLY foo_boo_fooboo
    ADD CONSTRAINT foo_boo FOREIGN KEY (boo) REFERENCES fooo(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE foobar ALTER COLUMN "a" DROP NOT NULL;
ALTER TABLE foobar2 ALTER COLUMN "b" DROP DEFAULT;
ALTER TABLE "foozbar" ALTER COLUMN name TYPE VARCHAR(1024);
alter table "foo" alter column "foo" SET NOT NULL;

alter table foo drop constraint my_bar_constraint;

alter table foobar
    drop constraint my_constraint,
    add constraint my_other_constraint foreign key (field) references myTable(id) on update cascade on delete RESTRICT;

ALTER TABLE "foo"."fooTable" ADD COLUMN fooColumn VARCHAR(255); 

ALTER TABLE "foo"."fooTable" 
    ADD COLUMN fooColumnList VARCHAR(255)[],
    ADD COLUMN barColumnList int[],
    ADD COLUMN barfooColumnList timestamptz[];

ALTER TABLE foo ADD COLUMN "bar" VARCHAR(255)[] NOT NULL DEFAULT array['push','email']::VARCHAR(255)[];;

ALTER TABLE ONLY transactions
      ADD CONSTRAINT transaction_transaction_type_id
      FOREIGN KEY (transaction_type_id)
      REFERENCES transaction_types (id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
      NOT VALID;

ALTER TABLE internal_transactions
        ADD CONSTRAINT internal_transactions_referral_earnings_type CHECK (
          type != 'foobar' OR
          foo IS NOT NULL
        );

ALTER TABLE foo ALTER COLUMN bar TYPE some_enum USING source::some_enum AND 1 = 1 OR 4=4 AND 3=3;

ALTER TABLE foo ADD CONSTRAINT foo_check CHECK (bar IS NOT NULL) NOT VALID;

ALTER TABLE foo VALIDATE CONSTRAINT foo_bar;