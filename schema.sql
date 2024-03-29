CREATE TABLE block (
    id TEXT, -- Note: a PRIMARY KEY will substantially slow down imports
    version integer NOT NULL,
    last_version integer,
    type TEXT NOT NULL,
    properties TEXT,
    content TEXT,
    discussions TEXT,
    view_ids TEXT,
    collection_id TEXT,
    format TEXT,
    permissions TEXT,
    created_by TEXT,
    created_time integer,
    last_edited_by TEXT,
    last_edited_time integer,
    parent_id TEXT NOT NULL,
    parent_table TEXT NOT NULL,
    alive integer NOT NULL,
    copied_from TEXT,
    file_ids TEXT,
    ignore_block_count integer,
    is_template integer,
    created_by_table TEXT,
    created_by_id TEXT,
    last_edited_by_table TEXT,
    last_edited_by_id TEXT,
    content_classification TEXT,
    space_id TEXT NOT NULL,
    moved TEXT
) STRICT;
