
create table foo (column1 INT, column2 INT DEFAULT 4, column3 text, column4 boolean default true);

alter table foo alter column column1 set default 1;
alter table foo alter column column2 SET default 2;

-- alter table foo alter column column3 SET default '2';

alter table foo alter column column4 SET default false;