UPDATE transaction_normalizers SET fieldname = 'name', case_sensitive = TRUE;

UPDATE services SET slug = name WHERE slug IS NULL;

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
UPDATE services SET slug = name WHERE slug IS NULL;

UPDATE
	transaction_normalizers
SET
	a = 1,
	a = 1,
	a = 1,
	a = 1,
	a = 1,
	a = 1,
	a = 1,
	a = 1,
	a = 1;

UPDATE
	services
SET
	slug = name
WHERE
	slug IS NULL AND foo = 1 OR
	bar IS NULL AND pumpkin = 'bar' AND yo = 4 AND TRUE = TRUE;