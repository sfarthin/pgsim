-- foo
-- foo
CREATE TABLE adsiiodnsaoidnoasindosaind9 (
	-- integer
	ahahhahah INTEGER,
	-- asdasd asasd asd
	ahahhahah INTEGER,
	aa INTEGER NOT NULL DEFAULT 1 PRIMARY KEY,
	-- int
	aab INTEGER DEFAULT '4',
	-- int4
	aac INT4,
	aa BIGINT DEFAULT 1,
	-- 1
	-- 2
	-- 3
	-- 4
	-- 5
	-- 6
	ab INT8 NOT NULL,
	-- 1
	-- 2
	-- 3
	-- 4
	-- 5
	ac BIGSERIAL NULL,
	ad SERIAL8 UNIQUE,
	ae SERIAL,
	af SERIAL4,
	aba BIT(1),
	abb BIT(2),
	abc BIT VARYING,
	abca BIT VARYING(3),
	abd VARBIT,
	abda VARBIT(3),
	bba INTERVAL,
	bbb INTERVAL DAY TO HOUR,
	ba BOOL DEFAULT TRUE,
	bbaa BOOLEAN,
	caa BOX,
	cba BYTEA,
	-- hello
	cc CIDR,
	-- yo
	-- yo
	cd CIRCLE,
	ce DATE,
	cf INET,
	cg LINE,
	ch LSEG,
	ci MACADDR,
	cj MONEY,
	ck TSQUERY,
	cl TSVECTOR,
	cm TXID_SNAPSHOT,
	cn UUID,
	co XML,
	daa REAL,
	dba FLOAT4,
	dda SMALLINT,
	ddb INT2,
	da DOUBLE PRECISION,
	db FLOAT8,
	eaa DECIMAL,
	eb DECIMAL,
	eca DECIMAL(5),
	ecb DECIMAL(5),
	eccv DECIMAL(5, 2),
	ecd DECIMAL(5, 2),
	bb VARCHAR(255),
	bc VARCHAR(4),
	bd VARCHAR,
	be VARCHAR,
	bf VARCHAR(235),
	bg CHAR,
	bh CHAR(4),
	bi CHAR,
	bj CHAR(4),
	bk TEXT,
	caz TIMESTAMP WITH TIME ZONE,
	cbx TIMESTAMPTZ,
	cax TIME WITH TIME ZONE DEFAULT now(),
	cbxx TIMETZ
);

CREATE TABLE some_table (
	-- This comment will go with "c"
	c INTEGER
);

CREATE TABLE reference_examples (
	a INTEGER REFERENCES products,
	-- 1
	-- 2
	-- 3
	-- 4
	-- 5
	-- 6
	-- 7
	-- 8
	bss INTEGER REFERENCES products (some_id),
	c INTEGER,
	FOREIGN KEY (c) REFERENCES other_table (c1)
);

CREATE TABLE reference_group_examples (
	a INTEGER REFERENCES products,
	b INTEGER,
	c INTEGER,
	FOREIGN KEY (b, c) REFERENCES other_table (c1, c2)
);

CREATE TABLE foo (
	a SOME_CUSTOM_TYPE
);

-- we can parse the schema
CREATE TABLE buckets.foo (
	a INTEGER
);

-- we can parse the schema, and automatically remove public from schema name.
CREATE TABLE public.foo (
	b INTEGER
);