CREATE TABLE aaa (
  a VARCHAR(16) NOT NULL,
  b INT NOT NULL,
  c VARCHAR(254) DEFAULT NULL,
  UNIQUE(a),
  UNIQUE(c)
);

-- Now make (a, b) unique (instead of just (a))
CREATE UNIQUE INDEX key3 ON aaa(a, b);
