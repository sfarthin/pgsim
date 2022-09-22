-- 1
INSERT/* 2 */INTO      /* 3 */SequelizeMeta/* 4 */(/* 5 */name/* 6 */           )/* 7 */VALUES/* 8 */(1); -- 9

INSERT INTO "foo" ("foobar", "pumpkin") VALUES (1, '1');

INSERT INTO foo (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,x,y,z) VALUES ('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z');

INSERT INTO "foo" ("foobar", "pumpkin") VALUES (1, '1') returning id, foo.id;

INSERT INTO "SequelizeMeta" ("name") VALUES ($1) RETURNING "name";