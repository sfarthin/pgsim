SELECT
	FALSE;

SELECT
	NOT FALSE;

SELECT
	NOT FALSE;

SELECT
	TRUE OR
	FALSE;

SELECT
	TRUE AND
	FALSE;

SELECT
	TRUE OR
	TRUE OR
	TRUE;

SELECT
	TRUE OR
	FALSE AND
	TRUE;

SELECT
	TRUE AND
	FALSE OR
	TRUE;

SELECT
	FALSE AND
	(
		FALSE OR
		TRUE
	);

SELECT
	TRUE AND
	FALSE OR
	TRUE OR
	FALSE;

SELECT
	TRUE AND
	TRUE AND
	FALSE OR
	TRUE;

SELECT
	TRUE AND
	TRUE AND
	(
		FALSE OR
		TRUE
	);

SELECT
	TRUE OR
	TRUE OR
	(
		FALSE OR
		TRUE
	);

SELECT
	(
		FALSE OR
		TRUE
	) AND
	TRUE;

SELECT
	(
		FALSE OR
		TRUE
	) AND
	NOT TRUE;

SELECT
	(
		FALSE OR
		FALSE AND
		(
			TRUE OR
			FALSE
		)
	) AND
	(
		FALSE OR
		FALSE AND
		(
			TRUE OR
			FALSE
		)
	);

SELECT
	4 IN (
		1,
		2,
		3,
		4
	);

SELECT
	400 IN (
		SELECT
			4
	);