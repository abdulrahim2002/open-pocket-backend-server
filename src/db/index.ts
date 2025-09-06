import mainConfig       from "@src/configs/main.config.js";
import articlesSchema   from "@src/db/schemas/articles.schema.js";
import tagsSchema       from "@src/db/schemas/tags.schema.js";
import usersSchema      from "@src/db/schemas/users.schema.js";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

const schema = {
    articles: articlesSchema,
    tags: tagsSchema,
    users: usersSchema,
};

const db: NodePgDatabase<typeof schema> = drizzle(mainConfig.DATABASE_URL, { schema  });

export default db;