import db from "@src/db/index.js";
import { reset } from "drizzle-seed";
import { usersSchema } from "@src/db/schemas/users.schema.js";
import { tagsSchema } from "@src/db/schemas/tags.schema.js";

// warn users
console.warn(   "CAUTION: THIS WILL CLEAR ALL TABLES IN THE DATABASE." +
                "PLEASE DO NOT RUN IN PRODUCTION!");

beforeAll(async () => {

    // delete users and tags table before running any test suite
    await reset(db, {
        // table_name: tableSchemaObject
        users: usersSchema,
        tags: tagsSchema,
    });

});