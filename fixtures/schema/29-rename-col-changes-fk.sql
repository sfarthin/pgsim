CREATE TABLE aaa (id INT PRIMARY KEY);
CREATE TABLE bbb (
  a INT,
  CONSTRAINT foo FOREIGN KEY (a) REFERENCES aaa (id)
);

-- Now rename the `aaa.id` column. The FK reference in table `bbb` should now
-- also change.
ALTER TABLE aaa RENAME COLUMN id TO a_id;
