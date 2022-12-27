-- 1
INSERT/* 2 */INTO      /* 3 */SequelizeMeta/* 4 */(/* 5 */name/* 6 */           )/* 7 */VALUES/* 8 */(1); -- 9

INSERT INTO "foo" ("foobar", "pumpkin") VALUES (1, '1');

INSERT INTO foo (a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,x,y,z) VALUES ('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z');

INSERT INTO "foo" ("foobar", "pumpkin") VALUES (1, '1') returning id, foo.id;

INSERT INTO "SequelizeMeta" ("name") VALUES ($1) RETURNING "name";

INSERT INTO foo (foo, bar)
          VALUES (
            'foo',
            (select id from foobar where foo = 'bar')
          );

INSERT INTO foo (some_id, some_boolean) ( 
  select id, false from bar
);

INSERT INTO foo (some_id, some_boolean) select id, false from bar;

INSERT INTO foo (some_id, some_boolean) ( 
  select id, false,e,r,t,y,u,sdf,dsf,sdf,sdf,sdf,sdf,sdfsd,sdfsdf from bar
);

INSERT INTO foo (foo,bar) values (1,2), (1,2), (1,2), (1,2);