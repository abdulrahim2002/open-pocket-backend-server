/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#tagging
 **/
import { pgTable, serial, text, primaryKey, foreignKey, index } from "drizzle-orm/pg-core";
import { usersSchema } from "@src/db/schemas/users.schema.js";

export const tagsSchema = pgTable(
    "tags",
    {
        user_id:        serial().notNull(),
        article_id:     serial().notNull(),
        tag:            text().notNull(),
    },
    (table): any[] => [
        primaryKey({columns: [tagsSchema.tag, tagsSchema.user_id]}),
        foreignKey({
            columns: [ tagsSchema.user_id ],
            foreignColumns: [ usersSchema.user_id ]
        }),
        index().on(table.tag),
    ]
);
