-- https://doxygen.postgresql.org/primnodes_8h_source.html line 609

SELECT
    *
FROM
    foo
WHERE
    exists (SELECT foo);


-- SELECT
--     *
-- FROM
--     foo
-- WHERE
--     0 > (SELECT 1)