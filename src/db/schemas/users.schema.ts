/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#users
 **/
import * as dpg from "drizzle-orm/pg-core";

export const usersSchema = dpg.pgTable(
    "users",
    {
        uid:        dpg.serial().primaryKey(),
        provider:   dpg.text().notNull().default("open-pocket"),
        name:       dpg.text().notNull(),
        email:      dpg.text().unique(),
    },
    (table) => [
        dpg.index("email_index").on(table.email),
    ]
);
