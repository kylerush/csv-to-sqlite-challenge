# CSV to SQLite Challenge

Your goal is to get the 10085126 rows in `big.csv` into a SQLite table as quickly as possible, while respecting the Postgres null convention:

- A totally empty CSV cell eg, `FirstCell,,ThirdCell`, should be treated as sql `NULL`.
- A quoted empty CSV cell eg, `FirstCell,"",ThirdCell` should be treated as sql `''` (empty string).

The `sqlite3` cli that comes with SQLite will load both kinds of empty cell as sql `''` (empty string), which means (for example) `block.last_version` could be `''`.

## Setup

0. Download the compressed `big.csv` from [Github releases](https://github.com/makenotion/csv-to-sqlite-challenge/releases/tag/v1) and it.
1. Create a database containing the block table: `sqlite3 demo.sqlite < schema.sql`
2. Run your program to load big.csv into the block table. Note the first row is CSV header and shouldn't be included.

   Example (will fail due to null handling): `sqlite3 demo.sqlite '.import --csv --skip 1 big.csv block'`
