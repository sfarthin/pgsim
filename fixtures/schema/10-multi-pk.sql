CREATE TABLE aaa (id INT, PRIMARY KEY (id));
CREATE TABLE bbb (id INT, PRIMARY KEY (id));

CREATE TABLE ccc (
  a INT,
  b INT,

  -- Multi-column PK
  PRIMARY KEY (a, b),

  FOREIGN KEY (a) REFERENCES aaa (id),  -- Will NOT create implicit index (because PK covers it)
  FOREIGN KEY (b) REFERENCES bbb (id)  -- Will NOT create implicit index (because "xyz" does explicitly)
);

CREATE INDEX xyz ON ccc (b);
