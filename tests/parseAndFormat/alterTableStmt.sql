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