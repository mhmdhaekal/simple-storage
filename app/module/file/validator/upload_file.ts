import { file, object, string } from "valibot";

export const upload_schema = object({
	file: file(),
	key: string(),
});
