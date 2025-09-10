/**
 * Define schema for `articles` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#articles
 **/
import usersSchema              from "@src/db/schemas/users.schema.js";
import {    bigint, integer, smallint,
            text, boolean, pgTable, timestamp,
            index, foreignKey } from "drizzle-orm/pg-core";


const articlesSchema = pgTable(
    "articles",
    {
        item_id:            bigint({mode: "bigint"}).primaryKey().generatedAlwaysAsIdentity(),
        user_id:            integer().notNull(),
        status:             smallint().notNull().default(0),
        favorite:           boolean().default(false),
        given_url:          text().notNull(),
        given_title:        text(),
        resolved_title:     text(),
        resolved_url:       text(),
        excerpt:            text(),
        is_article:         boolean(),
        is_index:           boolean(),
        has_video:          smallint().default(0),
        has_image:          smallint().default(0),
        word_count:         integer(),
        time_added:         timestamp({withTimezone: true}).defaultNow(),
        time_updated:       timestamp({withTimezone: true}).defaultNow(),
        top_image_url:      text(),
        author_id:          integer(),
    },
    (table): any[] => [
        index().on(table.user_id),
        index().on(table.author_id),
        index().on(table.time_added),
        foreignKey({
            columns: [ articlesSchema.user_id ],
            foreignColumns: [ usersSchema.user_id ],
        }),
    ]
);

export default articlesSchema;
