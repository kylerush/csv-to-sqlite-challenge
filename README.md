# CSV to SQLite Challenge

Your goal is to get the 10085126 rows in `big.csv` into a SQLite table as quickly as possible, while respecting the Postgres null convention:

- A totally empty CSV cell eg, `FirstCell,,ThirdCell`, should be treated as sql `NULL`.
- A quoted empty CSV cell eg, `FirstCell,"",ThirdCell` should be treated as sql `''` (empty string).

The `sqlite3` cli that comes with SQLite will load both kinds of empty cell as sql `''` (empty string), which means (for example) `block.last_version` could be `''`.

## Setup

0. Download the compressed `big.csv` from Github releases and it.
1. Create a database containing the block table: `sqlite3 demo.sqlite < schema.sql`
2. Run your program to load big.csv into the block table. Note the first row is CSV header and shouldn't be included.

   Example (will not pass the following check): `sqlite3 demo.sqlite '.import --csv --skip 1 big.csv block'`

3. Check that nulls are handled correctly:

   `sqlite3 demo.sqlite 'select typeof(last_version) from block'`. It must always be `integer` or `null`, it must never be `text`.

   ```text
   |null
   |null
   |null
   |null
   |null
   ```

## Performance

My current results on a MacBook Pro M1 Max 64gb:

```txt
2024/03/16 15:27:21 table 'block' file 'big.csv' inserted 10085126 rows in 50.388817041s (50.388817041s)
```
