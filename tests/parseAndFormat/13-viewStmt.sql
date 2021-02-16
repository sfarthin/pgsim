/* 1 */CREATE /* 2 */VIEW /* 3 */foo /* 4 */as /* 5 */select /* 6 */1; -- 7


CREATE VIEW myView AS SELECT myTable.myColumn FROM myTable;
CREATE VIEW myView AS SELECT myTable.myColumn FROM myTable WHERE 1 = 1;