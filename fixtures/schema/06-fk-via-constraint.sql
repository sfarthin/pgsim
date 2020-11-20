CREATE TABLE lusers (id INT PRIMARY KEY);

-- Simple case
CREATE TABLE foo (user_id INT);
ALTER TABLE foo ADD CONSTRAINT abc FOREIGN KEY (user_id) REFERENCES lusers (id);

-- (1) Same, but now with FKs "battling" for the constraint name
CREATE TABLE bar (user_id INT);
ALTER TABLE bar ADD CONSTRAINT klm FOREIGN KEY (user_id) REFERENCES lusers (id);
ALTER TABLE bar ADD CONSTRAINT pqr FOREIGN KEY (user_id) REFERENCES lusers (id);
ALTER TABLE bar ADD CONSTRAINT xyz FOREIGN KEY (user_id) REFERENCES lusers (id);

-- (2) Same, but with FKs "battling" for the same name that's equal to the given name
CREATE TABLE qux (user_id INT);
ALTER TABLE qux ADD CONSTRAINT foo FOREIGN KEY (user_id) REFERENCES lusers (id);
ALTER TABLE qux ADD CONSTRAINT bar FOREIGN KEY (user_id) REFERENCES lusers (id);
