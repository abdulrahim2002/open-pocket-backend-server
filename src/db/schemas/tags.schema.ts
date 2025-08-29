/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#tags
 **/
import { integer, pgTable, serial, text, foreignKey, index, unique } from "drizzle-orm/pg-core";
import { usersSchema } from "@src/db/schemas/users.schema.js";

export const tagsSchema = pgTable(
    "tags",
    {
        tag_id:         serial().primaryKey(),
        user_id:        integer().notNull(),
        article_id:     integer().notNull(),
        tag_name:       text().notNull(),
    },
    (table): any[] => [
        foreignKey({
            columns: [ tagsSchema.user_id ],
            foreignColumns: [ usersSchema.user_id ]
        }),
        index().on(table.tag_name, table.user_id),
        index().on(table.user_id, table.article_id),
        unique().on(table.tag_name, table.user_id, table.article_id),
    ]
);
