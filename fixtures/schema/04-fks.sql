CREATE TABLE lusers (id INT PRIMARY KEY);
CREATE TABLE foo (user_id INT);

-- Foreign keys create local index implicitly: KEY `user_id` (`user_id`)
ALTER TABLE foo ADD FOREIGN KEY (user_id) REFERENCES lusers (id);
