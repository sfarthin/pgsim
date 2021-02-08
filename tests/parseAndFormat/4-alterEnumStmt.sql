-- https://www.postgresql.org/docs/current/sql-altertype.html

alter type foo add value 'ag';

ALTER TYPE foo ADD VALUE 'asdsadyoyoy' BEFORE 'foo2';
ALTER TYPE foo ADD VALUE 'asdsad';
ALTER TYPE foo ADD VALUE 'asdsad' AFTER 'foo2';
ALTER TYPE foo ADD VALUE IF NOT EXISTS 'asdsad' BEFORE 'foo2';
/* 1 */ ALTER/* 2 */TYPE/* 3 *//* 4 */foo/* 5 */RENAME/* 6 */ VALUE /* 7 */'existing_enum_value' /* 8 */TO/* 9 */ 'new_enum_value'/* 10 */; -- 11
