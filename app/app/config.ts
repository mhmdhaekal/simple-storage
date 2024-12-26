import { resolve, join } from "path";
import { existsSync, mkdirSync } from "fs";

export type Config = Readonly<{
	database_url: string;
	database_auth_token: string;
	port: number;
	base_path: string;
	upload_path: string;
}>;

export class ConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConfigError";
	}
}

const init = (): Config => {
	let base_path = Bun.env.STORAGE_BASE_PATH ?? process.cwd();
	let abs_path = resolve(base_path);

	if (!existsSync(abs_path)) {
		throw new Error("Invalid Base Path: Directory does not exist");
	}

	const upload_path = join(abs_path, "uploads");

	if (!existsSync(upload_path)) {
		mkdirSync(upload_path, { recursive: true });
		console.log(`Created uploads directory: ${upload_path}`);
	}

	const config = {
		database_url: Bun.env.DATABASE_URL?.trim() ?? "",
		database_auth_token: Bun.env.DATABASE_AUTH_TOKEN?.trim() ?? "",
		port: Number.parseInt(Bun.env.PORT?.trim() ?? "3000"),
		base_path,
		upload_path,
	};

	const validation_result = validate_config(config);

	if (!validation_result.isValid) {
		throw new ConfigError(
			`Invalid configuration: ${validation_result.errors.join(", ")}`,
		);
	}

	return Object.freeze(config);
};

type ValidationResult = {
	isValid: boolean;
	errors: string[];
};

const validate_config = (config: Config): ValidationResult => {
	const errors: string[] = [];

	if (config.database_url === "") errors.push("DATABASE_URL is missing");

	if (Bun.env.NODE_ENV === "production") {
		if (config.database_auth_token === "")
			errors.push("DATABASE_AUTH_TOKEN is missing");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const get_config_or_throw = () => {
	const config = init();
	const validationResult = validate_config(config);
	if (!validationResult.isValid) {
		throw new Error(
			`Configuration Error: ${validationResult.errors.join(", ")}`,
		);
	}
	return config;
};
