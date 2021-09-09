-- +	addition	2 + 3	5
SELECT
	2 + 3;

-- -	subtraction	2 - 3	-1
SELECT
	2 - 3;

-- *	multiplication	2 * 3	6
SELECT
	2 * 3;

-- /	division (integer division truncates the result)	4 / 2	2
SELECT
	4 / 2;

-- %	modulo (remainder)	5 % 4	1
SELECT
	5 % 4;

-- ^	exponentiation (associates left to right)	2.0 ^ 3.0	8
SELECT
	2.0 ^ 3.0;

-- |/	square root	|/ 25.0	5
SELECT
	|/ 25.0;

-- ||/	cube root	||/ 27.0	3
SELECT
	||/ 27.0;

-- !	factorial	5 !	120
SELECT
	5!;

-- !!	factorial (prefix operator)	!! 5	120
SELECT
	!! 5;

-- @	absolute value	@ -5.0	5
SELECT
	@ -5.0;

-- &	bitwise AND	91 & 15	11
SELECT
	91 & 15;

-- |	bitwise OR	32 | 3	35
SELECT
	32 | 3;

-- #	bitwise XOR	17 # 5	20
SELECT
	17 # 5;

-- ~	bitwise NOT	~1	-2
SELECT
	~ 1;

-- <<	bitwise shift left	1 << 4	16
SELECT
	1 << 4;

-- >>	bitwise shift right	8 >> 2
SELECT
	8 >> 2;