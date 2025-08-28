/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#tagging
 **/
import * as dpg from "drizzle-orm/pg-core";
import { usersSchema } from "./users.schema.ts";

export const tagsSchema = dpg.pgTable(
    "tags",
    {
        user_id:        dpg.serial().notNull(),
        article_id:     dpg.serial().notNull(),
        tag:            dpg.text().notNull(),
    },
    (table): any[] => [
        dpg.primaryKey({columns: [tagsSchema.tag, tagsSchema.user_id]}),
        dpg.foreignKey({
            columns: [ tagsSchema.user_id ],
            foreignColumns: [ usersSchema.user_id ]
        })
    ]
);
