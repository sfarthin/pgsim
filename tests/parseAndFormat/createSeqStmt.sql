CREATE SEQUENCE foo; -- This has no options

/* 1 */
CREATE SEQUENCE foo -- 2
    -- Start With 1
    START WITH 1
    INCREMENT BY 1 -- INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    NO CYCLE
    CACHE 1
    OWNED BY NONE; -- foo bac
    -- another comment
    -- and another

    -- foo bar


CREATE SEQUENCE if not exists foo2
MINVALUE 4
MAXVALUE 6
INCREMENT 2 -- different variation
start 2 -- different variation
CYCLE
OWNED BY foo.bar;