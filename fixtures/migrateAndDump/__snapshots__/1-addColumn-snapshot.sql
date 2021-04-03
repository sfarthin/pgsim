
--- 1

CREATE TABLE public.foo (
	column1 INTEGER,
	column2 INTEGER,
	column3 TEXT,
	column4 VARCHAR(255)
);
--- 2
CREATE TABLE public.foo (
	column1 INTEGER
);
ALTER TABLE foo ADD column2 integer, ADD column3 text, ADD column4 varchar(255);
--- 3
CREATE TABLE public.foo (
	column1 INTEGER,
	column2 INTEGER
);
ALTER TABLE foo ADD column3 text, ADD column4 varchar(255);
--- 4
CREATE TABLE public.foo (
	column1 INTEGER,
	column2 INTEGER,
	column3 TEXT
);
ALTER TABLE foo ADD column4 varchar(255);