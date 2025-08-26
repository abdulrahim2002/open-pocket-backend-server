import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import mainConfig from "@src/configs/main.config.js";

const db: NodePgDatabase = drizzle(mainConfig.DATABASE_URL);

export default db;