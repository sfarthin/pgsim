-- 1
-- 2
-- 3
-- 4
CREATE VIEW foo AS (
	-- 5
	-- 7
	SELECT
		-- 6
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
		-- 3
		-- 4
		mytable
	WHERE
		-- 5
		-- 6
		-- 7
		foo = 1
);
