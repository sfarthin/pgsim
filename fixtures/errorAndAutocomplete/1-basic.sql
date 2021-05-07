-- @error-statement { "token": "SELECT", "expected": ["!","!=","#","%","&","*","+",",","-","/","::",";","<","<<","<=","<>","=",">",">=",">>","AND","AS","End of Input","FROM","GROUP","IN","OR","ORDER","^","identifier","in","|"] }
SELECT 1
SELECT 2

-- @error-statement { "token": "hello", "expected": ["ALTER", "CREATE", "DROP", "SELECT", "SET"] } 

hello

-- @error-statement { "token": "select", "expected":   ["!!","'","(","*","-","/[0-9]/","@","EXISTS","NOT","bigint","bigserial","bit","bit varying","bool","boolean","box","bytea","char","character","character varying","cidr","circle","content","date","decimal","double precision","false","float4","float8","heap","identifier","inet","int","int2","int4","int8","integer","interval","json","jsonb","line","lseg","macaddr","money","null","numeric","off","oid","on","path","pg_catalog","pg_catalog.set_config","pg_lsn","point","polygon","real","regclass","regoper","regoperator","regproc","regprocedure","regtype","serial","serial2","serial4","serial8","smallint","smallserial","text","time","time with time zone","timestamp","timestamp with time zone","timestamptz","timetz","true","tsquery","tsvector","txid_snapshot","uuid","varbit","varchar","warning","xml","|/","||/","~"] } 

select /* yoyoyoy */
select
