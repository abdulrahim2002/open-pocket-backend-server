import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import app from "@src/app.js";

const db: NodePgDatabase = drizzle(app.config.DATABASE_URL);

export default db;