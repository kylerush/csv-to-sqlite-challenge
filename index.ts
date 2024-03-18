import { db } from "./db.ts";

const file = Bun.file("big.csv");
const stream = file.stream()
const decoder = new TextDecoder("utf-8");

const insert = db.prepare(`
  INSERT INTO block
    (
      id,
      version,
      last_version,
      type,
      properties,
      content,
      discussions,
      view_ids,
      collection_id,
      format,
      permissions,
      created_by,
      created_time,
      last_edited_by,
      last_edited_time,
      parent_id,
      parent_table,
      alive,
      copied_from,
      file_ids,
      ignore_block_count,
      is_template,
      created_by_table,
      created_by_id,
      last_edited_by_table,
      last_edited_by_id,
      content_classification,
      space_id,
      moved
    )
      VALUES (
        $id,
        $version,
        $last_version,
        $type,
        $properties,
        $content,
        $discussions,
        $view_ids,
        $collection_id,
        $format,
        $permissions,
        $created_by,
        $created_time,
        $last_edited_by,
        $last_edited_time,
        $parent_id,
        $parent_table,
        $alive,
        $copied_from,
        $file_ids,
        $ignore_block_count,
        $is_template,
        $created_by_table,
        $created_by_id,
        $last_edited_by_table,
        $last_edited_by_id,
        $content_classification,
        $space_id,
        $moved
      );
`)

let chunkCount = 0;
let incompleteRow = "";
for await (const chunk of stream) {
  // if (chunkCount > 1) {
  //   break
  // }

  const text = decoder.decode(chunk);
  let rows = text.split("\n");

  // Remove the CSV header row
  if (chunkCount === 0) {
    rows.shift();
  }

  const formattedRows: Row[] = [];

  // Split row into columns
  for (let row of rows) {

    // Stitch together the row that got cut off in the stream chunk (if any)
    if (incompleteRow) {
      row = incompleteRow + row;
      incompleteRow = "";
    }

    // Split the row into columns
    const columns = row.split(",")
    const properties = columns.slice(4, -24)
    let cols = []
    cols = cols.concat(columns.slice(0, 4))
    cols.push(properties.join(""))
    cols = cols.concat(columns.slice(-24))

    // Each row should have a length of 29; if not, it's an incomplete row due to stream chunk
    if (cols.length !== 29){
      incompleteRow = row;
      continue;
    }

    const formattedColumns = parseColumns(cols);
    // if (cols[17] !== "1") {
    //   console.log(cols[17])
    //   console.log(row)
    //   console.log(`length: ${cols.length}`)
    //   console.log(`columns: ${columns}`)
    //   console.log(`properties: ${properties}`)
    //   console.log(`slice: ${columns.slice(0, 4)}`)
    //   console.log(`last slize: ${columns.slice(-24)}`)
    //   console.log(formattedColumns)
    //   console.log("\n\n\n\n")
    // }
    if (
      (typeof formattedColumns.$alive === "number" && !Number.isNaN(formattedColumns.$alive)) &&
      (typeof formattedColumns.$version === "number" && !Number.isNaN(formattedColumns.$version))
      ) {
      formattedRows.push(formattedColumns);
    }
  }

  // Create a transaction to insert the rows
  const insertRows = db.transaction((rows) => {
    // console.log(rows)
    for (const row of rows) {
      insert.run(row)
    }
  })

  // Insert the formatted rows
  insertRows(formattedRows);

  chunkCount ++;
}

interface Row {
  $id: string
  $version: number
  $last_version: number
  $type: string
  $properties: string | null
  $content: string | null
  $discussions: string | null
  $view_ids: string | null
  $collection_id: string | null
  $format: string | null
  $permissions: string | null
  $created_by: string | null
  $created_time: number | null
  $last_edited_by: string | null
  $last_edited_time: number | null
  $parent_id: string
  $parent_table: string
  $alive: number
  $copied_from: string | null
  $file_ids: string | null
  $ignore_block_count: number
  $is_template: number
  $created_by_table: string | null
  $created_by_id: string | null
  $last_edited_by_table: string | null
  $last_edited_by_id: string | null
  $content_classification: string | null
  $space_id: string
  $moved: string | null
}

db.close()

function parseColumns(cols: string[]): Row {
  // console.log(cols)
  // if (Number.isNaN(parseInt(cols[17]))) {
  //   console.log(`value that produces NaN: "${cols[17]}"`)
  // }
  // console.log(parseInteger(""))
  return {
    $id: cols[0],
    $version: parseInt(cols[1]),
    $last_version: parseInt(cols[2]),
    $type: cols[3],
    $properties: cols[4] || null,
    $content: cols[5] || null,
    $discussions: cols[6] || null,
    $view_ids: cols[7] || null,
    $collection_id: cols[8] || null,
    $format: cols[9] || null,
    $permissions: cols[10] || null,
    $created_by: cols[11] || null,
    $created_time: parseInteger(cols[12]),
    $last_edited_by: cols[13] || null,
    $last_edited_time: parseInteger(cols[14]),
    $parent_id: cols[15],
    $parent_table: cols[16],
    $alive: parseInt(cols[17]),
    $copied_from: cols[18] || null,
    $file_ids: cols[19] || null,
    $ignore_block_count: parseInt(cols[20]),
    $is_template: parseInt(cols[21]),
    $created_by_table: cols[22] || null,
    $created_by_id: cols[23] || null,
    $last_edited_by_table: cols[24] || null,
    $last_edited_by_id: cols[25] || null,
    $content_classification: cols[26] || null,
    $space_id: cols[27],
    $moved: cols[28] || null,
  }
}

function parseInteger(value: string): number | null {
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? null : number;
}