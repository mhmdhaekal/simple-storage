import { vValidator } from "@hono/valibot-validator";
import appFactory from "../../app/app.factory";
import { upload_schema } from "./validator/upload_file";
import { basename, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { HTTPException } from "hono/http-exception";
import { file } from "../../database/schema/file";
import { eq, exists } from "drizzle-orm";
import { returns } from "valibot";
import { stream } from "hono/streaming";
import { getConnInfo } from "hono/bun";

let app = appFactory.createApp();

app.post("/", vValidator("form", upload_schema), async (c) => {
	let data = c.req.valid("form");
	let content_type = c.req.header("Content-Type");
	let config = c.get("config");
	let db_client = c.get("db");
	let full_path = join(config.upload_path, data.key);
	let directory = join(full_path, "..");

	try {
		if (!existsSync(directory)) {
			mkdirSync(directory, { recursive: true });
		}

		Bun.write(full_path, data.file);
	} catch {
		throw new HTTPException(500, {
			message: "Internal Server Error",
		});
	}

	let now = new Date();

	let result = await db_client
		.insert(file)
		.values({
			soft_id: Bun.randomUUIDv7().toString(),
			key: data.key,
			mime_type: content_type ?? "",
			file_size: data.file.size,
		})
		.returning({
			soft_id: file.soft_id,
			key: file.key,
		});

	if (result.length !== 1) {
		throw new HTTPException(500, {
			message: " Internal Server Error",
		});
	}

	return c.json({
		status: 200,
		message: "Success upload file",
		ip_address: getConnInfo(c).remote.address,
		data: {
			soft_id: result[0].soft_id,
			key: result[0].key,
		},
	});
});

app.get("/:file_id", async (c) => {
	let file_id = c.req.param("file_id");

	let config = c.get("config");
	let db = c.get("db");

	if (!file_id || file_id === "") {
		throw new HTTPException(400);
	}

	let stored_file = await db.query.file.findFirst({
		where: eq(file.soft_id, file_id),
	});

	if (!stored_file) {
		throw new HTTPException(404);
	}

	let file_full_path = join(config.upload_path, stored_file.key);
	let file_buffer = Bun.file(file_full_path);
	let exist = await file_buffer.exists();

	if (!exist) {
		throw new HTTPException(500);
	}

	let readable_stream = file_buffer.stream();

	let file_name = basename(stored_file.key);

	c.header("Content-Type", stored_file.mime_type);
	c.header("Content-Disposition", `inline; filename=${file_name}`);

	return stream(c, async (stream) => {
		await stream.pipe(readable_stream);
	});
});

app.get("/", async (c) => {
	let db = c.get("db");
	let files = await db.query.file.findMany();
	return c.json({
		status: 200,
		message: "Success get all files",
		ip_address: getConnInfo(c).remote.address,
		data: {
			files,
		},
	});
});

export default app;
