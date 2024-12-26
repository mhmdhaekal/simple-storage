import { sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { vValidator } from "@hono/valibot-validator";

export const file = sqliteTable("file", {
	id: integer("id", {
		mode: "number",
	})
		.primaryKey({
			autoIncrement: true,
		})
		.unique(),
	soft_id: text("soft_id", {
		length: 36,
	})
		.unique()
		.notNull(),
	key: text("key", {
		length: 512,
	}).notNull(),
	file_size: integer("file_size", {
		mode: "number",
	}).notNull(),
	mime_type: text().notNull(),
	created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updated_at: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

type test = typeof file.$inferInsert;
