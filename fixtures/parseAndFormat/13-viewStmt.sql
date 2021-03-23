/* 1a */CREATE /* 2a */VIEW /* 3a */foo /* 4a */as /* 5a */select /* 6a */1; -- 7a


CREATE VIEW myView AS SELECT myTable.myColumn FROM myTable;
CREATE VIEW myView AS SELECT /* 1 */myColumn /* 2 */FROM /* 3 */myTable /* 4 */WHERE/* 5 */foo/* 6 */=/* 7 */1;