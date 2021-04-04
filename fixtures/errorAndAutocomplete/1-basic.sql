-- @error-statement { "token": "SELECT", "expected":  [",","::",";","=","AND","AS","End of Input","FROM","IN","OR","ORDER","in"] }
SELECT 1
SELECT 2

-- @error-statement { "token": "hello", "expected": ["ALTER", "CREATE", "DROP", "SELECT", "SET"] } 

hello

-- @error-statement { "token": "select", "expected":  ["'","(","*","/[0-9]/","EXISTS","NOT","content","false","heap","identifier","null","off","on","pg_catalog.set_config","true","warning"] } 

select /* yoyoyoy */
select
