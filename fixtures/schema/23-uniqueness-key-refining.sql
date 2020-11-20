CREATE TABLE aaa (id INT PRIMARY KEY);

CREATE TABLE xyz (
  id SERIAL NOT NULL PRIMARY KEY,
  a INT NULL DEFAULT NULL,
  b VARCHAR(254),
  CONSTRAINT a FOREIGN KEY (a) REFERENCES aaa (id)
);

-- Create a unique index on (b) first
ALTER TABLE xyz ADD CONSTRAINT key1 UNIQUE (b);

-- Then create one on (b, a). The resulting table should have two UNIQUE indexes
ALTER TABLE xyz ADD CONSTRAINT key2 UNIQUE (b, a);
