CREATE TABLE lusers (id INT PRIMARY KEY);
CREATE TABLE a (user_id INT);

-- Adding a second FK reuses implicit local index created as a side-effect by
-- first FK
ALTER TABLE a ADD FOREIGN KEY (user_id) REFERENCES lusers (id);
ALTER TABLE a ADD FOREIGN KEY (user_id) REFERENCES lusers (id);
