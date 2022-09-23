# PGSIM

PGSIM is a parser, linter, formatter and static analysis tool for Postgres.

## Roadmap

- finish tb/migrations.sql file
- parse/format COPY queries
- Fix error messages.
- Finish linter with @pgsim-lint-ignore, @pgsim-expect-parse-error to skip statements or lint errors
- Add Github action(s) to run tests.
- Update documentation and make limited alpha "release"
- Work through parsing/formatting all TB queries from itests
- Build pgstructure adapter and simulator pg schema tables.

- Add `loc` to tokens.
- Profile and continue to optomize,
  - Use regex
  - cache(pos, stringify_name) ?
