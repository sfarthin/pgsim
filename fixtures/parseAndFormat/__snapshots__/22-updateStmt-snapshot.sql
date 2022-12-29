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

UPDATE accounts a SET institution_id = a.b;

UPDATE accounts a SET institution_id = a.b;

UPDATE
	accounts a
SET
	institution_id = (SELECT id FROM institutions WHERE plaid_type = a.institution_type)
WHERE
	institution_id IS NULL;

UPDATE foo SET bar = somefield || 1;

UPDATE
	foo
SET
	bar = ARRAY[770, 630, 207, 403, 310, 423, 246, 318, 680, 299, 1025];

UPDATE foo SET bar = NULL FROM monkey WHERE 1 = 1;