import { defineConfig } from "prisma/config";

export default defineConfig({
  migrate: {
    datasourceUrl: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
