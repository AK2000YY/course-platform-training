import { env } from "@/data/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    ssl: false,
  },
  strict: true,
  verbose: true,
});
