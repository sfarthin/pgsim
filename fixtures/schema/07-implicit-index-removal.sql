CREATE TABLE lusers (id INT, PRIMARY KEY (id));

CREATE TABLE aaa (
  id BIGSERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES lusers (id)
);

-- Create explicit index
CREATE INDEX aaa_user_id_idx ON aaa (user_id);

-- Adding this UNIQUE constraint should not delete the explicitly-created index on line 10
ALTER TABLE aaa ADD CONSTRAINT xyz UNIQUE (user_id);
