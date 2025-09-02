import mainConfig from "@src/configs/main.config.js";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

const db: NodePgDatabase = drizzle(mainConfig.DATABASE_URL);

export default db;