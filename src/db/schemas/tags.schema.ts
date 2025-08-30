/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#tags
 **/
import usersSchema  from "@src/db/schemas/users.schema.js";
import {    integer, bigint, pgTable, text,
            foreignKey, index, unique } from "drizzle-orm/pg-core";

const tagsSchema = pgTable(
    "tags",
    {
        tag_id:         integer().primaryKey().generatedAlwaysAsIdentity(),
        user_id:        integer().notNull(),
        item_id:        bigint({mode: "bigint"}).notNull(),
        tag_name:       text().notNull(),
    },
    (table): any[] => [
        foreignKey({
            columns: [ tagsSchema.user_id ],
            foreignColumns: [ usersSchema.user_id ]
        }),
        index().on(table.tag_name, table.user_id),
        index().on(table.user_id, table.item_id),
        unique().on(table.tag_name, table.user_id, table.item_id),
    ]
);

export default tagsSchema;