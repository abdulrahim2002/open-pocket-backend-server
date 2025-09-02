import app from "@src/app.js";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

const db: NodePgDatabase = drizzle(app.config.DATABASE_URL);

export default db;