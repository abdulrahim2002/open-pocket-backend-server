/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#users
 **/
import { pgTable, text, index, integer } from "drizzle-orm/pg-core";

const usersSchema = pgTable(
    "users",
    {
        user_id:    integer().primaryKey().generatedAlwaysAsIdentity(),
        provider:   text().notNull().default("open-pocket"),
        name:       text().notNull(),
        email:      text().unique(),
        hashed_password: text(),
    },
    (table) => [
        index("email_index").on(table.email),
    ]
);

export default usersSchema;