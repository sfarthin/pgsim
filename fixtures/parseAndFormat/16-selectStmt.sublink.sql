-- https://doxygen.postgresql.org/primnodes_8h_source.html line 609

SELECT
    *
FROM
    foo
WHERE
    0 > (SELECT 1);

SELECT
    foo1
FROM
    foo
WHERE
    exists (SELECT foo);

select (select 1);

SELECT
    foo
FROM
    foo
WHERE 
    -- Double connector
    subscriptions.transaction_name::text IN ( SELECT foo );