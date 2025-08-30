/**
 * Define schema for `users` table.
 * See: https://abdulrahim2002.github.io/open-pocket-backend-server/docs/Database-Layer/database-schema/#articles
 **/
import {    bigint, integer, smallint,
            text, boolean, pgTable, timestamp,
            index } from "drizzle-orm/pg-core";


const articlesSchema = pgTable(
    "articles",
    {
        item_id:            bigint({mode: "bigint"}).primaryKey().generatedAlwaysAsIdentity(),
        user_id:            integer().notNull(),
        status:             smallint().notNull().default(0),
        favorite:           boolean().default(false),
        resolved_title:     text(),
        resolved_url:       text(),
        excerpt:            text(),
        is_article:         boolean(),
        is_index:           boolean(),
        has_video:          boolean(),
        has_image:          boolean(),
        word_count:         integer(),
        time_added:         timestamp({withTimezone: true}).defaultNow(),
        time_updated:       timestamp({withTimezone: true}).defaultNow(),
        top_image_url:      text(),
        author_name:        text(),
    },
    (table) => [
        index().on(table.user_id),
        index().on(table.author_name),
    ]
);

export default articlesSchema;