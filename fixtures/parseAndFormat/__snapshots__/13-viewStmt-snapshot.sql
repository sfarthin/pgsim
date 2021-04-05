-- 1a
-- 2a
-- 3a
-- 4a
CREATE VIEW foo AS (
	-- 5a
	-- 7a
	SELECT
		-- 6a
		1
);

CREATE VIEW myview AS (
	SELECT
		mytable.mycolumn
	FROM
		mytable
);

CREATE VIEW myview AS (
	SELECT
		-- 1
		-- 2
		mycolumn
	FROM
		-- 4
		-- 3
		mytable
	WHERE
		-- 5
		-- 6
		-- 7
		foo = 1
);