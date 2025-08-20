import { defineConfig } from 'drizzle-kit';

/**
 * See: https://orm.drizzle.team/docs/drizzle-config-file
 **/
export default defineConfig({
    out: './drizzle',
    dialect: 'postgresql',
    schema: './src/db/schemas',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});