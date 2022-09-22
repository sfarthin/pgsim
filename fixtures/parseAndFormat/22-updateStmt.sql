UPDATE 
    transaction_normalizers 
SET 
    fieldname = 'name', 
    case_sensitive = true ;

UPDATE services SET slug=name WHERE slug IS NULL; 