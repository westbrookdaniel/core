import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "~/db/schema";

const connectionString = Bun.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const sql = postgres(connectionString, { max: 1 });

export const db = drizzle(sql, { schema });

export * from "drizzle-orm";
export * from "~/db/schema";

await migrate(db, { migrationsFolder: "drizzle" });
