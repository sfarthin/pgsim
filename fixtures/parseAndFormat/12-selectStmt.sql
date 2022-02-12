-- SELECT from dump.
SELECT false;
SELECT false, true;
select 2;
select 2.0;

SELECT 
-- foo
false, 
-- bar
true;
SELECT true = true;

select 1 as Foo;
select 1 as "Foo";
SELECT foo FROM "public"."foo";
SELECT foo FROM (foo JOIN bar ON (foo.id = bar.id));

-- one-off
SELECT pg_catalog.set_config('search_path', '', false);
select nextval('accounts_id_seq' :: regclass);

-- Can wrap in typecast or parens
SELECT 4::text;
SELECT (4);
SELECT '1'::int;
SELECT ||/ '1'::int;
SELECT ||/ - 1;
-- Can handle big ints and negatives
SELECT 2147483647;
SELECT 2147483648;
SELECT -4;
SELECT -49999999999999999999999999999999999999999999999999999999999999999999999999999999;
SELECT - 4;
-- Can handle various expressions with different operations.
SELECT 4 < 4.0 * 3;
SELECT 4 * 4.0 < 3;
SELECT 4 * 4.0 * 3;
SELECT 4 - 4.0 * 3;
SELECT 4 - 4.0 + 3;
SELECT 4 * 4.0 / 3;

-- We can use STAR
SELECT * FROM foo;
SELECT count(*) from foo;

-- We can give aliases
SELECT 1 foo;
SELECT 1 as foo;
SELECT 1 as "foo";
SELECT NULL;
SELECT 1 is NOT NULL;
SELECT 1 is NULL;
SELECT * FROM users as u;
SELECT * FROM users u;
SELECT * FROM schema.u;

-- We can do ordering.
SELECT 1 ORDER BY 1;
SELECT 1 ORDER BY 1 DESC;
SELECT 1 ORDER BY 1 ASC;
SELECT 1, 2 ORDER BY 1 ASC, 2;
SELECT 1, 2 as foo ORDER BY 1 ASC, foo;
SELECT foo['1'];
SELECT foo [ '2' ];
SELECT foo(c.foo);

-- Precedence
SELECT 1 + 1::int;
SELECT 1::int + 1;
SELECT foo[0] + 1;
SELECT 1 + foo[0];
SELECT foo::int;
SELECT (5 !) - 6;
SELECT 1 * 2 - 3;
SELECT 1 * (2 - 3);
SELECT 1 - 2 - 3;
SELECT 1 - 2 - -3;
SELECT -2 - 2;
SELECT -2 - -2.20;
SELECT 1 + 2 ^ 2;
SELECT 2 ^ 2 + 1;
SELECT 1 * 2 + 3;
SELECT 2 + 2 * 2;
SELECT 2 + (2 * 2);
SELECT 0 > (SELECT 1);
SELECT false;
SELECT NOT false;
SELECT (NOT false);
SELECT TRUE OR FALSE;
SELECT TRUE AND FALSE;
SELECT TRUE OR TRUE OR TRUE;
SELECT TRUE OR FALSE AND TRUE;
SELECT TRUE AND FALSE OR TRUE;
SELECT FALSE AND (FALSE OR TRUE);
SELECT TRUE AND FALSE OR TRUE OR False;
SELECT TRUE AND TRUE AND FALSE OR TRUE;
SELECT TRUE AND TRUE AND (FALSE OR TRUE);
SELECT TRUE OR TRUE OR (FALSE OR TRUE);
SELECT (FALSE OR TRUE) AND TRUE;
SELECT (FALSE OR TRUE) AND NOT TRUE;
SELECT (FALSE OR (FALSE AND (TRUE OR FALSE))) AND (FALSE OR (FALSE AND (TRUE OR FALSE)));
SELECT 4 in (1 , 2,3,4);
SELECT 400     in (SELECT 4);
SELECT 1 = 1;
SELECT 1 = 1 AND 2 = 2;
SELECT 1 = 1 AND true;
SELECT true AND 1 = 1;
SELECT (1, '2'::text, (1,2,asdsad));
SELECT 1 in (1,2,3);
SELECT '1' || '2';
SELECT (1 and 2);

SELECT * FROM foo WHERE 0 < (SELECT 1)

;

-- SELECT true= true; -- This is different from...
SELECT true = true; -- this... wierd. 
-- I guess we assume column names are assumed on the left in aExpr.