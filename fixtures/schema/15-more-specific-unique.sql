CREATE TABLE aaa (id INT PRIMARY KEY);

-- (1)
CREATE TABLE ccc (
  id SERIAL PRIMARY KEY,
  a INT,
  b INT,

  -- Addition of this FK will create implicit key1
  CONSTRAINT key1 FOREIGN KEY (a) REFERENCES aaa (id),
  CONSTRAINT key2 FOREIGN KEY (b) REFERENCES aaa (id),

  -- Addition of UNIQUE index will remove implicit key1 in favor of richer key3
  UNIQUE(a, b)
);

-- (2) Same as above, but now with manually added key0
CREATE TABLE ddd (
  id INT PRIMARY KEY,
  a INT,
  b INT,

  CONSTRAINT key1 FOREIGN KEY (a) REFERENCES aaa (id),
  CONSTRAINT key2 FOREIGN KEY (b) REFERENCES aaa (id),
  UNIQUE(a, b)
);

CREATE INDEX key0 ON ddd (a);
