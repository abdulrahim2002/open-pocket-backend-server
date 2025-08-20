/**
 * Define schema for `test` table.
 **/
import * as dpg from 'drizzle-orm/pg-core';

export const usersSchema = dpg.pgTable(
    'test',
    {
        id:   dpg.serial().primaryKey().unique(),
        name: dpg.text(),
    }
);
