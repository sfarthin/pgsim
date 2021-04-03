
--- 1

CREATE TABLE public.foo (
);
--- 2
CREATE TABLE public.foo (
	column1 INTEGER,
	column2 INTEGER
);
ALTER TABLE foo DROP column1, DROP column2;
--- 3
CREATE TABLE public.foo (
	column1 INTEGER
);
ALTER TABLE foo DROP column1;
--- 4
CREATE TABLE public.foo (
);
