import { secureHeaders } from "hono/secure-headers";
import appFactory from "./app.factory";
import type { Config } from "./config";
import { logger } from "hono/logger";

export const initApp = (config: Config) => {
	const app = appFactory.createApp();

	app.use(secureHeaders());
	app.use(logger());

	return app;
};
