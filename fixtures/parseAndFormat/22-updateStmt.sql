UPDATE 
    transaction_normalizers 
SET 
    fieldname = 'name', 
    case_sensitive = true ;

UPDATE services SET slug=name WHERE slug IS NULL; 


-- 1
UPDATE/* 2 */services/* 3 */SET/* 4 */slug/* 5 */=/* 6 */name/* 7 */WHERE/* 8 */slug/* 9 */IS/* 10 */NULL;  -- 11


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

UPDATE services SET slug=name WHERE slug IS NULL AND foo = 1 OR BAR is NULL AND pumpkin='bar' AND yo = 4 and true = true; 


UPDATE accounts a SET institution_id = a.b;

UPDATE accounts as a SET institution_id = a.b;


UPDATE accounts a
        SET institution_id =
        (SELECT id FROM institutions WHERE plaid_type = a.institution_type)
        WHERE institution_id IS NULL;

UPDATE foo SET bar = someField || 1;

UPDATE foo SET bar = ARRAY[770,630,207,403,310,423,246,318,680,299,1025];