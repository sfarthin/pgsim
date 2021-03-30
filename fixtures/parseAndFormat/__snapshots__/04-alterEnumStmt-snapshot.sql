-- https://www.postgresql.org/docs/current/sql-altertype.html

ALTER TYPE foo ADD VALUE 'ag';

ALTER TYPE foo ADD VALUE 'asdsadyoyoy' BEFORE 'foo2';

ALTER TYPE foo ADD VALUE 'asdsad';

ALTER TYPE foo ADD VALUE 'asdsad' AFTER 'foo2';

ALTER TYPE foo ADD VALUE IF NOT EXISTS 'asdsad' BEFORE 'foo2';

-- 1
-- 2
-- 3
-- 4
-- 5
-- 6
-- 7
-- 8
-- 9
-- 10
-- 11
ALTER TYPE foo RENAME VALUE 'existing_enum_value' TO 'new_enum_value';