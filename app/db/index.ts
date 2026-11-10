import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "~/db/schema";

export type AppDatabase = DrizzleD1Database<typeof schema>;

export function createDatabase(d1: D1Database): AppDatabase {
  return drizzle(d1, { schema });
}
