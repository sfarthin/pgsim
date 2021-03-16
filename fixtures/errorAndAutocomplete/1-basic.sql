-- @statement { "line": 3, "column": 1, "expected": ["::", "=", "AND", "FROM", "OR"] }
SELECT 1
SELECT 2

-- @statement { "line": 7, "column": 1, "expected": ["ALTER", "CREATE", "DROP", "SELECT", "SET"] } 

hello

-- @statement { "line": 12, "column": 1, "expected": ["'","(","/[0-9]/","NOT","content","false","heap","identifier","null","off","on","pg_catalog.set_config","true","warning"] } 

select /* yoyoyoy */
select