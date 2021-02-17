/* 1 */CREATE /* 2 */VIEW /* 3 */foo /* 4 */as /* 5 */select /* 6 */1; -- 7


CREATE VIEW myView AS SELECT myTable.myColumn FROM myTable;
CREATE VIEW myView AS SELECT /* 1 */myColumn /* 2 */FROM /* 3 */myTable /* 4 */WHERE/* 5 */foo/* 6 */=/* 7 */1;