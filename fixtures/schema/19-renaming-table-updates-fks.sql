CREATE TABLE aaa (id INT PRIMARY KEY);
CREATE TABLE bbb (a INT, FOREIGN KEY (a) REFERENCES aaa (id));

-- Renaming `aaa` should also update all FKs pointing to it
ALTER TABLE aaa RENAME TO xyz;
