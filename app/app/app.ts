import { secureHeaders } from "hono/secure-headers";
import appFactory from "./app.factory";
import type { Config } from "./config";
import { logger } from "hono/logger";
import fileRoute from "../module/file/route";

export const initApp = (config: Config) => {
	const app = appFactory.createApp();

	app.use(secureHeaders());
	app.use(logger());

	app.route("/file", fileRoute);

	return app;
};
