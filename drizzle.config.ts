import { defineConfig } from "drizzle-kit";
export default defineConfig({
	dialect: "turso",
	schema: "./app/database/schema/*",
	dbCredentials: {
		url: process.env.DATABASE_URL?.trim() ?? "",
		authToken: process.env.AUTH_TOKEN,
	},
});
