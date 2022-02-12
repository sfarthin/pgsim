SELECT * FROM foo GROUP BY created_at;

SELECT * FROM foo GROUP BY /*foo*/ created_at;

SELECT * FROM foo GROUP BY one,two,/*goo*/three;

SELECT * FROM foo JOIN f ON (true = true);
-- SELECT * FROM foo JOIN f ON (true=true);

SELECT * FROM foo JOIN f ON (true = true AND false = false AND 1=1) group by a.b, c;

SELECT * FROM foo WHERE 1=1 group by a.b, c;