CREATE /*foo */ TABLE adsiiodnsaoidnoasindosaind9 -- foo
(
    -- integer
    ahahhahah integer,
    ahahhahah integer, /* asdasd */ /* asasd */ -- asd
    aa integer NOT NULL DEFAULT 1 PRIMARY KEY,
    aab int DEFAULT '4', -- int
    /* int4 */
    aac int4,

    aa bigint DEFAULT 1,
    /* 1 */ ab /* 2 */ int8 /* 3 */ NOT /* 4 */ NULL /* 5 */, -- 6
    /* 1 */ ac /* 2 */ bigserial /* 3 */ NULL /* 4 */, -- 5
    ad serial8 UNIQUE,
    ae serial,
    af serial4,
    aba bit,
    abb bit(2),
    abc bit varying,
    abca bit varying(3),
    abd varbit,
    abda varbit(3),

    bba interval,
    bbb interval day to hour,

    ba bool DEFAULT true,
    bbaa boolean,

    caa box,
    cba bytea,
    cc /* hello */ cidr,
    cd /* yo */ circle /* yo */,
    ce date,
    cf inet,
    cg line,
    ch lseg,
    ci macaddr,
    cj money,
    ck tsquery,
    cl tsvector,
    cm txid_snapshot,
    cn uuid,
    co xml,

    daa real,
    dba float4,

    dda smallint,
    ddb int2,

    da double precision,
    db float8,

    eaa decimal,
    eb numeric,
    eca decimal(5),
    ecb numeric(5),
    eccv decimal(5,2),
    ecd numeric(5,2),

    bb character varying(255),
    bc character varying(4),
    bd character varying,
    be varchar,
    bf varchar(235),
    bg character,
    bh character(4),
    bi char,
    bj char(4),
    bk text,

    caz timestamp with time zone,
    cbx timestamptz,
    cax time with time zone default now(),
    cbxx timetz   
);

create table some_table (
    c integer -- This comment will go with "c"
    
);

create table reference_examples (
    a integer references products,
    /* 1 */ bss /* 2 */ integer /* 3 */ references /* 4 */ products /* 5 */ ( /* 6 */some_id /* 7 */), -- 8
    c integer,
    FOREIGN KEY (c) REFERENCES other_table (c1)
);

create table reference_group_examples (
    a integer references products,
    b integer,
    c integer,
    FOREIGN KEY (b,c) REFERENCES other_table (c1, c2)
);

create table foo (
    a some_custom_type
);

create table foo (
    a "some_custom_type"
);

create table foo (
    a "public"."some_custom_type"
);

-- we can parse the schema
create table buckets.foo (
    a int
);

-- we can parse the schema, and automatically remove public from schema name.
create table public.foo (
    b int,
    interval1 interval YEAR,
    interval2 interval MONTH,
    interval3 interval DAY,
    interval4 interval HOUR,
    interval5 interval MINUTE,
    interval6 interval SECOND,
    interval7 interval YEAR TO MONTH,
    interval8 interval DAY TO HOUR,
    interval9 interval DAY TO MINUTE,
    interval10 interval DAY TO SECOND,
    interval11 interval HOUR TO MINUTE,
    interval12 interval HOUR TO SECOND,
    interval13 interval MINUTE TO SECOND
);

CREATE TABLE 
    IF NOT EXISTS 
    foobar 
    (
        "id"  SERIAL , 
        "subscription_id" INTEGER NOT NULL REFERENCES "subscriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("id")
    );