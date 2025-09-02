import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.USER!,
    password: process.env.PASSWORD!,
    database: process.env.DATABASE!,
    host: process.env.HOST!,
    ssl: false,
  },
  strict: true,
  verbose: true,
});
