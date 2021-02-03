create table foo (column1 INT);

alter table foo add column2 int;

alter table foo add column3 int;

-- Test run:
-- pg_sim.dump === pg_dump
-- pg_sim.dump(STATEMENT1, pg_sim.migrate(STATEMENT1, FULL_DUMP)) === pg_dump
-- pg_sim.dump(STATEMENT1, STATEMENT2, pg_sim.migrate(STATEMENT1 + STATEMENT2, FULL_DUMP)) === pg_dump
-- ^^ continue for all statements.