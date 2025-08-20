import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

if ( !process.env.DATABASE_URL ) {
    throw new Error('DATABASE_URL is not defined');
}

const db: NodePgDatabase = drizzle(process.env.DATABASE_URL!);

export default db;