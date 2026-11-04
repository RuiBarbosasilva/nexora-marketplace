import "dotenv/config";
import { defineConfig } from "prisma/config";

// A harmless local fallback allows schema validation and client generation
// in CI without connecting to a database. Migrations still require a real URL.
const datasourceUrl =
  process.env.DATABASE_URL ??
  "postgresql://nexora_app:change_me@localhost:5432/nexora_dev?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
