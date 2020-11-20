CREATE TABLE aaa (id INT PRIMARY KEY);

CREATE TABLE bbb (a INT, FOREIGN KEY (a) REFERENCES aaa (id));

-- Now change the column. This should give a warning because it's used in an FK.
ALTER TABLE bbb ALTER COLUMN a SET NOT NULL;
