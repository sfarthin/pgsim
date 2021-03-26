-- This has no options
CREATE SEQUENCE foo;

-- 1
-- 2
-- Start With 1
-- foo bac
CREATE SEQUENCE foo 
	START WITH 1
	INCREMENT BY 1
	-- INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	NO CYCLE
	CACHE 1
	OWNED BY NONE;

-- another comment
-- and another
-- foo bar

CREATE SEQUENCE IF NOT EXISTS foo2 
	MINVALUE 4
	MAXVALUE 6
	INCREMENT BY 2
	-- different variation
	START WITH 2
	-- different variation
	CYCLE
	OWNED BY foo.bar;
