-- All keywords are lowercase

create table aaa (id int primary key);
create table bbb (id int primary key);
alter table bbb
  add column a int null,
  add foreign key(a) references aaa(id);
  --             ^^^^^^^
  --             This should not be interpreted as an identifier, but as
  --             a keyword
